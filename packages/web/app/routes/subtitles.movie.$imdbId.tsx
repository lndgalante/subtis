import type { LoaderFunctionArgs } from "@remix-run/node";
import { type MetaFunction, useLoaderData } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useAnimation } from "motion/react";

// api
import type { SubtitleNormalized } from "@subtis/api";

// shared external
import { getApiClient } from "@subtis/shared";

// shared internal
import { VideoDropzone } from "~/components/shared/video-dropzone";

// icons
import { CheckIcon } from "~/components/icons/check";
import { DownloadIcon } from "~/components/icons/download";

// lib
import { cn } from "~/lib/utils";

// ui
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { DataTable } from "~/components/ui/data-table";
import DotPattern from "~/components/ui/dot-pattern";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { imdbId } = params;

  if (!imdbId) {
    throw new Error("Missing imdbId");
  }

  const apiClient = getApiClient({
    apiBaseUrl: "https://api.subt.is" as string,
  });

  const primarySubtitleResponse = await apiClient.v1.subtitles.movie[":imdbId"].$get({
    param: {
      imdbId,
    },
  });

  const primarySubtitle = await primarySubtitleResponse.json();

  return primarySubtitle;
};

// meta
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || "message" in data) {
    return [{ title: "Subtis" }, { name: "description", content: "Encontra tus subtítulos rápidamente!" }];
  }

  return [
    { title: `Subtis | Lista de subtítutlos para ${data.title.title_name}` },
    { name: "description", content: `Lista de subtítutlos para ${data.title.title_name}` },
  ];
};

export default function SubtitlesPage() {
  // remix hooks
  const data = useLoaderData<typeof loader>();

  // motion hooks
  const videoTipControl = useAnimation();
  const stremioTipControl = useAnimation();

  const resolutionTipControl = useAnimation();
  const formatTipControl = useAnimation();
  const publisherTipControl = useAnimation();

  // constants
  const columns: ColumnDef<SubtitleNormalized>[] = [
    {
      accessorKey: "index",
      header: () => <th>#</th>,
      cell: ({ row }) => {
        return <div className="w-6">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "subtitle.resolution",
      header: "Resolución",
    },
    {
      accessorKey: "release_group.release_group_name",
      header: "Publicador",
    },
    {
      accessorKey: "subtitle.rip_type",
      header: "Formato",
    },
    {
      accessorKey: "subtitle.queried_times",
      header: "Descargas",
    },
    {
      accessorKey: "",
      header: "Acciones",
      cell: ({ row }) => {
        // motion hooks
        const controls = useAnimation();

        // toast hooks
        const { toast } = useToast();

        // handlers
        async function handleDownloadSubtitle() {
          if ("message" in data) {
            return;
          }

          const apiClient = getApiClient({
            apiBaseUrl: "https://api.subt.is" as string,
          });

          await apiClient.v1.subtitle.metrics.download.$patch({
            json: { imdbId: data.title.imdb_id, subtitleId: row.original.subtitle.id },
          });

          toast({
            title: "Disfruta de tu subtítulo!",
            description: "Compartí tu experiencia en X",
            action: (
              <ToastAction altText="Compartir" onClick={() => {}}>
                Compartir
              </ToastAction>
            ),
          });
        }

        return (
          <a
            href={row.original.subtitle.subtitle_link}
            download
            className="inline-flex items-center gap-1"
            onMouseEnter={() => controls.start("animate")}
            onMouseLeave={() => controls.start("normal")}
            onClick={handleDownloadSubtitle}
          >
            <DownloadIcon size={16} controls={controls} />
          </a>
        );
      },
    },
  ];

  return (
    <div className="pt-24 pb-44 flex flex-col lg:flex-row justify-between gap-4">
      <article className="max-w-xl w-full">
        <section className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-zinc-50 text-5xl font-bold">Subtítulo encontrado!</h1>
            <h2 className="text-zinc-50 text-balance">
              Descarga el siguiente subtítulo para disfrutar de tu película.
            </h2>
          </div>
          {"message" in data ? null : (
            <div>
              <DataTable columns={columns} data={data.results} />
              <p className="text-sm mt-2 text-zinc-400">
                Si no encontras tu subtítulo acá, podés escribirnos a{" "}
                <a href="mailto:soporte@subt.is" className="underline hover:text-zinc-50 transition-all ease-in-out">
                  soporte@subt.is
                </a>
              </p>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-12 mt-16">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-zinc-50">Buscar nuevo subtítulo por archivo</h3>
            <h4 className="text-zinc-50">Querés buscar un subtítulo nuevo? Arrastra el archivo debajo.</h4>
          </div>
          <div className="bg-zinc-950 border border-zinc-700 rounded-sm group/video overflow-hidden h-64 relative">
            <VideoDropzone />
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] opacity-40 backdrop-blur-md group-hover/video:opacity-60 group-hover/video:scale-105 transition-all ease-in-out",
              )}
            />
          </div>
        </section>

        <Separator className="my-16 bg-zinc-700" />

        <section className="flex flex-col gap-12 mt-16">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-zinc-50">SubTips</h3>
            <h4 className="text-zinc-50">Te recomendamos algunos tips para una mejor experiencia</h4>
          </div>
          <Tabs defaultValue="choose-subtitle" className="min-h-[390px]">
            <TabsList className="mb-6">
              <TabsTrigger value="choose-subtitle" className="text-sm">
                ¿Cómo elegir un subtítulo?
              </TabsTrigger>
              <TabsTrigger value="play-subtitle" className="text-sm">
                ¿Cómo reproduzco un subtítulo?
              </TabsTrigger>
            </TabsList>

            <TabsContent value="choose-subtitle" className="flex flex-col gap-4 mt-0">
              <Alert
                className="bg-zinc-950 border border-zinc-800 flex items-start gap-4"
                onMouseEnter={() => resolutionTipControl.start("animate")}
                onMouseLeave={() => resolutionTipControl.start("normal")}
              >
                <CheckIcon size={24} controls={resolutionTipControl} />
                <div className="pt-1">
                  <AlertTitle className="text-zinc-50">Asegurate que la resolución matchee correctamente</AlertTitle>
                  <AlertDescription className="text-zinc-400 text-sm font-normal">
                    Por ejemplo para “The.Matrix.1999.<span className="font-semibold text-zinc-50">720p</span>
                    .BrRip.264.YIFI” selecciona el subtítulo cuya resolución sea{" "}
                    <span className="font-semibold text-zinc-50">720p</span>.
                  </AlertDescription>
                </div>
              </Alert>
              <Alert
                className="bg-zinc-950 border border-zinc-800 flex items-start gap-4"
                onMouseEnter={() => formatTipControl.start("animate")}
                onMouseLeave={() => formatTipControl.start("normal")}
              >
                <CheckIcon size={24} controls={formatTipControl} />
                <div className="pt-1">
                  <AlertTitle className="text-zinc-50">Asegurate que el formato matchee correctamente</AlertTitle>
                  <AlertDescription className="text-zinc-400 text-sm font-normal">
                    Por ejemplo para “The.Matrix.1999.720p.<span className="font-semibold text-zinc-50">BrRip</span>
                    .264.YIFI” selecciona el subtítulo cuyo formato sea{" "}
                    <span className="font-semibold text-zinc-50">BrRip</span>.
                  </AlertDescription>
                </div>
              </Alert>
              <Alert
                className="bg-zinc-950 border border-zinc-800 flex items-start gap-4"
                onMouseEnter={() => publisherTipControl.start("animate")}
                onMouseLeave={() => publisherTipControl.start("normal")}
              >
                <CheckIcon size={24} controls={publisherTipControl} />
                <div className="pt-1">
                  <AlertTitle className="text-zinc-50">Asegurate que el publicador matchee correctamente</AlertTitle>
                  <AlertDescription className="text-zinc-400 text-sm font-normal">
                    Por ejemplo para “The.Matrix.1999.720p.BrRip.264.
                    <span className="font-semibold text-zinc-50">YIFI</span> selecciona el subtítulo cuyo publicador sea{" "}
                    <span className="font-semibold text-zinc-50">YIFI</span>.
                  </AlertDescription>
                </div>
              </Alert>
            </TabsContent>

            <TabsContent value="play-subtitle" className="flex flex-col gap-4 mt-0">
              <Alert
                className="bg-zinc-950 border border-zinc-800 flex items-start gap-4"
                onMouseEnter={() => videoTipControl.start("animate")}
                onMouseLeave={() => videoTipControl.start("normal")}
              >
                <CheckIcon size={24} controls={videoTipControl} />
                <div className="pt-1">
                  <AlertTitle className="text-zinc-50">Si vas a usar un reproductor de video...</AlertTitle>
                  <AlertDescription className="text-zinc-400 text-sm font-normal">
                    Recorda mover el archivo del subtítulo a donde esté tu carpeta o bien reproducir la película y
                    arrastrar el subtítulo al reproductor.
                  </AlertDescription>
                </div>
              </Alert>
              <Alert
                className="bg-zinc-950 border border-zinc-800 flex items-start gap-4"
                onMouseEnter={() => stremioTipControl.start("animate")}
                onMouseLeave={() => stremioTipControl.start("normal")}
              >
                <CheckIcon size={24} controls={stremioTipControl} />
                <div className="pt-1">
                  <AlertTitle className="text-zinc-50">Si vas a usar Stremio...</AlertTitle>
                  <AlertDescription className="text-zinc-400 text-sm font-normal">
                    Te recomendamos usar el add-on oficial, y en caso que no quieras utilizar el add-on de Subtis,
                    también podes arrastrar el subtítulo al reproductor de Stremio.
                  </AlertDescription>
                </div>
              </Alert>
            </TabsContent>
          </Tabs>
        </section>
      </article>
      {"message" in data ? null : data.title.poster ? (
        <div className="hidden lg:flex flex-1 justify-center">
          <figure className="max-w-sm pt-12 flex flex-col items-center gap-2">
            <img
              alt={data.title.title_name}
              src={data.title.poster}
              className="object-cover rounded-md border border-zinc-700/80"
            />
            <figcaption className="text-zinc-400 text-sm">
              {data.title.title_name} ({data.title.year})
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}