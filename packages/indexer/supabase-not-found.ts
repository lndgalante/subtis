// db
import { supabase } from "@subtis/db";

// shared
import { getIsTvShow } from "@subtis/shared";

// api
import { subtitleSchema } from "@subtis/api/shared/schemas";

// internals
import { apiClient } from "./api-client";
import { sendEmail } from "./email";
import { indexTitleByFileName } from "./file";

export async function indexNotFoundSubtitlesFromSupabase() {
  supabase
    .channel("table-db-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "SubtitlesNotFound",
      },
      async (payload) => {
        const { new: newSubtitleNotFound } = payload;
        const { title_file_name, bytes, email } = newSubtitleNotFound;

        const isTvShow = getIsTvShow(title_file_name);

        // TODO: Temporarily skipping tv shows
        if (isTvShow) {
          console.log("Skipping tv show", title_file_name);
          return;
        }

        console.log("User was trying to watch:");
        console.table([{ title_file_name, bytes, email }]);

        const { ok } = await indexTitleByFileName({
          bytes: bytes,
          titleFileName: title_file_name,
          shouldStoreNotFoundSubtitle: false,
          isDebugging: false,
        });

        console.log("Subtitle found for ", title_file_name);

        if (ok === true) {
          if (email) {
            console.log(`sending email to ${email}...`);

            try {
              const response = await apiClient.v1.subtitle.file.name[":bytes"][":fileName"].$get({
                param: {
                  bytes: String(bytes),
                  fileName: title_file_name,
                },
              });

              const data = await response.json();
              const subtitleByFileName = subtitleSchema.safeParse(data);

              if (!subtitleByFileName.success) {
                throw new Error("Subtitle not found in some way");
              }

              await sendEmail(subtitleByFileName.data, email);
            } catch (error) {
              console.log("\n ~ forawait ~ error 2 after indexation:", error);
            }
          }

          const res = await supabase.from("SubtitlesNotFound").delete().eq("title_file_name", title_file_name);

          if (res.status === 200) {
            console.log("Subtitle removed from SubtitlesNotFound successfully");
          }
        }
      },
    )
    .subscribe();
}

// testing
indexNotFoundSubtitlesFromSupabase();