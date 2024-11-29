import type { LoaderFunctionArgs } from "@remix-run/node";
import { type MetaFunction, redirect, useLoaderData } from "@remix-run/react";
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

// hooks
import { useToast } from "~/hooks/use-toast";

// constants
export const columns: ColumnDef<SubtitleNormalized>[] = [
  {
    accessorKey: "index",
    header: "#",
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
        const apiClient = getApiClient({
          apiBaseUrl: "https://api.subt.is" as string,
        });

        await apiClient.v1.subtitle.metrics.download.$patch({
          json: { imdbId: row.original.title.imdb_id, subtitleId: row.original.subtitle.id },
        });

        toast({
          title: "Disfruta de tu subtítulo!",
          description: "Compartí tu experiencia en X",
          action: (
            <ToastAction altText="Compartir en X" onClick={() => {}}>
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { bytes, fileName } = params;

  if (!bytes || !fileName) {
    throw new Error("Missing bytes or fileName");
  }

  const apiClient = getApiClient({
    apiBaseUrl: "https://api.subt.is" as string,
  });

  const primarySubtitleResponse = await apiClient.v1.subtitle.file.name[":bytes"][":fileName"].$get({
    param: {
      bytes,
      fileName,
    },
  });

  if (primarySubtitleResponse.status === 404) {
    return redirect(`/real-time-search/${bytes}/${fileName}`);
  }

  if (!primarySubtitleResponse.ok) {
    return redirect(`/not-found/${bytes}/${fileName}`);
  }

  const primarySubtitle = await primarySubtitleResponse.json();

  return primarySubtitle;
};

// meta
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || "message" in data) {
    return [{ title: "Subtis" }, { name: "description", content: "Encontra tus subtítulos rápidamente!" }];
  }

  return [
    { title: `Subtis | Subtitulo para ${data.title.title_name} (${data.subtitle.title_file_name})` },
    { name: "description", content: `Subtitulo para ${data.title.title_name} (${data.subtitle.title_file_name})` },
  ];
};

export default function SubtitlePage() {
  // remix hooks
  const data = useLoaderData<typeof loader>();

  // motion hooks
  const videoTipControl = useAnimation();
  const stremioTipControl = useAnimation();

  if ("message" in data) {
    return null;
  }

  return (
    <div className="pt-24 pb-48 flex flex-col lg:flex-row justify-between gap-4">
      <article className="max-w-xl w-full">
        <section className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-zinc-50 text-5xl font-bold">Subtítulo encontrado!</h1>
            <h2 className="text-zinc-50 text-balance">
              Descarga el siguiente subtítulo para disfrutar de tu película.
            </h2>
          </div>
          <DataTable columns={columns} data={[data]} />
        </section>

        <section className="flex flex-col gap-12 mt-16">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-zinc-50">Buscar nuevo subtítulo por archivo</h3>
            <h4 className="text-zinc-400">Querés buscar un subtítulo nuevo? Arrastra el archivo debajo.</h4>
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
          <Tabs defaultValue="play-subtitle">
            <TabsList>
              <TabsTrigger value="play-subtitle" className="text-sm">
                ¿Cómo reproduzco un subtítulo?
              </TabsTrigger>
            </TabsList>
            <TabsContent value="play-subtitle" className="mt-6 flex flex-col gap-4">
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
      {data.title.poster ? (
        <figure className="max-w-sm pt-12 hidden lg:flex flex-col items-center gap-2">
          <img
            alt={data.title.title_name}
            src={data.title.poster}
            className="object-cover rounded-md border border-zinc-700/80"
          />
          <figcaption className="text-zinc-400 text-sm">
            {data.title.title_name} ({data.title.year})
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
