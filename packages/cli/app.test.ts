import { beforeAll, describe, expect, it } from "bun:test";

// api
import "@subtis/api";

// shared
import { getMessageFromStatusCode } from "@subtis/shared";

describe("CLI", async () => {
	beforeAll(async () => {
		const process = [
			"bun",
			"build",
			`${import.meta.dir.slice(0, -4)}/cli/app.ts`,
			"--compile",
			"--outfile",
			`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`,
		];

		Bun.spawn(process);
	});

	it("returns a message with a subtitle link with --file parameter", async () => {
		const developmentProcess = Bun.spawn([
			"bun",
			import.meta.resolveSync("./app.ts"),
			"--file",
			"Road.House.2024.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
		]);
		const binaryProcess = Bun.spawn([
			`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`,
			"--file",
			"Road.House.2024.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
		]);

		const processes = [developmentProcess, binaryProcess];
		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude("🥳 Descarga tu subtítulo en http://localhost:5173/2748");
			expect(text).toInclude("🍿 Disfruta de Road House (2024) en 1080p subtitulada");
		}
	});

	it("returns a message with a subtitle link with -f parameter", async () => {
		const developmentProcess = Bun.spawn([
			"bun",
			import.meta.resolveSync("./app.ts"),
			"-f",
			"Road.House.2024.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
		]);
		const binaryProcess = Bun.spawn([
			`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`,
			"-f",
			"Road.House.2024.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
		]);

		const processes = [developmentProcess, binaryProcess];

		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude("🥳 Descarga tu subtítulo en http://localhost:5173/2748");
			expect(text).toInclude("🍿 Disfruta de Road House (2024) en 1080p subtitulada");
		}
	});

	it("returns a message when none parameters is given", async () => {
		const developmentProcess = Bun.spawn(["bun", import.meta.resolveSync("./app.ts")]);
		const binaryProcess = Bun.spawn([`${process.env.PWD}/packages/cli/bin/subtis`]);

		const processes = [developmentProcess, binaryProcess];

		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude("🤔 Debe proporcionar --file [archivo] o bien -f [archivo]");
		}
	});

	it("returns a message when -f parameter is given without a file path", async () => {
		const developmentProcess = Bun.spawn(["bun", import.meta.resolveSync("./app.ts"), "-f"]);
		const binaryProcess = Bun.spawn([`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`, "-f"]);

		const processes = [developmentProcess, binaryProcess];

		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude("🤔 El valor de -f debe ser una ruta de archivo válida");
		}
	});

	it("returns a message when --file parameter is given without a file path", async () => {
		const developmentProcess = Bun.spawn(["bun", import.meta.resolveSync("./app.ts"), "--file"]);
		const binaryProcess = Bun.spawn([`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`, "--file"]);

		const processes = [developmentProcess, binaryProcess];

		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude("🤔 El valor de --file debe ser una ruta de archivo válida");
		}
	});

	it("returns a message when extension is not supported", async () => {
		const developmentProcess = Bun.spawn([
			"bun",
			import.meta.resolveSync("./app.ts"),
			"--file",
			"Trolls.Band.Together.2024.1080p.AMZN.WEBRip.1400MB.DD5.1.x264-GalaxyRG.mp3",
		]);
		const binaryProcess = Bun.spawn([
			`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`,
			"--file",
			"Trolls.Band.Together.2024.1080p.AMZN.WEBRip.1400MB.DD5.1.x264-GalaxyRG.mp3",
		]);

		const processes = [developmentProcess, binaryProcess];

		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude("🤔 Extensión de video no soportada. Prueba con otro archivo");
		}
	});

	it("returns a message when subtitle is not found", async () => {
		const developmentProcess = Bun.spawn([
			"bun",
			import.meta.resolveSync("./app.ts"),
			"--file",
			"The.Matrix.3.2024.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
		]);
		const binaryProcess = Bun.spawn([
			`${import.meta.dir.slice(0, -4)}/cli/bin/subtis.bin`,
			"--file",
			"The.Matrix.3.2024.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
		]);

		const processes = [developmentProcess, binaryProcess];

		for await (const process of processes) {
			const text = await new Response(process.stdout).text();

			const { description, title } = getMessageFromStatusCode(404);

			expect(text).toInclude("👋 Hola, soy Subtis");
			expect(text).toInclude(`😥 ${title}`);
			expect(text).toInclude(`⛏ ${description}`);
		}
	});
});
