import { useLoaderData } from "@remix-run/react";

// routes
import type { loader } from "~/routes/_index";

export function NewsSlider() {
  const { recentDownloadedTitles } = useLoaderData<typeof loader>();

  if ("message" in recentDownloadedTitles) {
    return null;
  }

  return (
    <div className="carousel carousel-start rounded-sm gap-3 py-3">
      {recentDownloadedTitles.results.map((title) => {
        if (!title.backdrop) {
          return null;
        }

        return (
          <div key={title.id} className="carousel-item cursor-pointer">
            <div className="w-72 h-[162.05px] relative rounded-sm overflow-hidden group/new-card">
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-b-sm group-hover/new-card:translate-y-full transition-all ease-in-out z-10">
                <span className="text-white text-sm">{title.title_name}</span>
              </div>
              <img
                alt={title.title_name}
                src={title.backdrop}
                className="w-full h-full object-cover group-hover/new-card:scale-110 transition-all ease-in-out rounded-sm"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}