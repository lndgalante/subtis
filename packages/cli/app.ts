import { intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";
import minimist from "minimist";
import { z } from "zod";

// shared
import { getMessageFromStatusCode, getSubtitleShortLink, videoFileNameSchema } from "@subtis/shared";

// api
import { subtitleSchema } from "@subtis/api";

// internals
import { apiClient } from "./api";

// schemas
const cliArgumentsSchema = z.union(
	[
		z.object({
			f: z.string().min(1, {
				message: "🤔 El valor de -f debe ser una ruta de archivo válida",
			}),
		}),
		z.object({
			file: z.string().min(1, {
				message: "🤔 El valor de --file debe ser una ruta de archivo válida",
			}),
		}),
	],
	{
		errorMap: (_, context) => {
			if (context.defaultError === "Invalid input") {
				return {
					message: "🤔 Debe proporcionar --file [archivo] o bien -f [archivo]",
				};
			}

			return { message: context.defaultError };
		},
	},
);

// core
export async function mod(): Promise<void> {
	const loader = spinner();

	try {
		intro(`👋 Hola, soy ${chalk.magenta("Subtis")}`);

		const parsedArguments = minimist(Bun.argv, { string: ["f", "file"] });
		const cliArgumentsResult = cliArgumentsSchema.safeParse(parsedArguments);
		if (!cliArgumentsResult.success) {
			return outro(chalk.yellow(cliArgumentsResult.error.errors[0].message));
		}
		const cliArguments = cliArgumentsResult.data;

		const fileNameResult = videoFileNameSchema.safeParse("file" in cliArguments ? cliArguments.file : cliArguments.f);
		if (!fileNameResult.success) {
			return outro(chalk.yellow("🤔 Extensión de video no soportada. Prueba con otro archivo"));
		}
		const fileName = fileNameResult.data;

		loader.start("🔎 Buscando subtitulos");

		const response = await apiClient.v1.subtitles.file.name.$post({
			json: {
				fileName,
				bytes: "",
			},
		});
		const data = await response.json();

		const subtitleByFileName = subtitleSchema.safeParse(data);
		if (!subtitleByFileName.success) {
			const { description, title } = getMessageFromStatusCode(response.status);
			loader.stop(`😥 ${title}`);
			return outro(`⛏ ${description}`);
		}

		loader.stop(`🥳 Descarga tu subtítulo en ${chalk.blue(getSubtitleShortLink(subtitleByFileName.data.id))}`);

		const {
			resolution,
			movie: { name, year },
		} = subtitleByFileName.data;
		outro(`🍿 Disfruta de ${chalk.bold(`${name} (${year})`)} en ${chalk.italic(resolution)} subtitulada`);

		const shouldDownloadSubtitle = await confirm(`Desea descargar ${chalk.italic("automáticamente")} el subtítulo?`);

		if (shouldDownloadSubtitle) {
			const result = await fetch(subtitleByFileName.data.subtitleLink);
			await Bun.write(`./${subtitleByFileName.data.subtitleFileName}`, result);
		} else {
			console.log(chalk.bold("\nInstrucciones:"));
			console.log(`1) Mueve el archivo descargado a la ${chalk.bold("misma carpeta")} de tu película`);
			console.log(
				`2) Si el subtítulo no se reproduce, ${chalk.bold("selecciona")} el subtitulo en ${chalk.italic(
					"Menú -> Subtítulos -> Pista de Subtítulos",
				)}\n`,
			);
		}
	} catch (error) {
		if (error instanceof Error) {
			outro(chalk.red(`🔴 ${error.message}`));
		}
	} finally {
		process.exit();
	}
}

mod();
