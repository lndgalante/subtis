import { useNavigate } from "@remix-run/react";

// shared external
import { getApiClient } from "@subtis/shared";

// ui
import { AutoComplete } from "~/components/ui/autocomplete";

// types
type Result = {
  value: string;
  label: string;
  optimizedPoster: string | null;
};

type Props = {
  inputValue: string;
  setInputValue: (value: string) => void;
  data:
    | {
        results: Result[];
        statusCode: number;
      }
    | undefined;
  error: Error | null;
  isLoading: boolean;
  minimumCharacters: number;
  onClearInputValue: () => void;
};

export function AutocompleteTitles({
  inputValue,
  setInputValue,
  data,
  error,
  isLoading,
  minimumCharacters,
  onClearInputValue,
}: Props) {
  // remix hooks
  const navigate = useNavigate();

  const noResultsMessage = "No hay resultados.";
  const difference = minimumCharacters - inputValue.length;
  const minimumCharactersMessage = `Ingresa al menos ${difference} ${difference > 1 ? "caracteres" : "caracter"} para buscar.`;

  const emptyMessage = error
    ? "Error al buscar."
    : inputValue.length > 0 && inputValue.length < minimumCharacters
      ? minimumCharactersMessage
      : data?.results.length === 0
        ? noResultsMessage
        : "";

  // handlers
  async function handleUpdateSearchMetrics(imdbId: string) {
    const apiClient = getApiClient({
      apiBaseUrl: "https://api.subt.is" as string,
    });

    await apiClient.v1.title.metrics.search.$patch({
      json: {
        imdbId,
      },
    });
  }

  return (
    <AutoComplete
      options={data && data.statusCode === 200 ? data.results : []}
      emptyMessage={emptyMessage}
      placeholder="¿Qué vas a ver hoy?"
      onInputChange={(inputValue) => {
        if (typeof inputValue === "string") {
          setInputValue(inputValue);
        }
      }}
      onValueChange={(selectedValue) => {
        handleUpdateSearchMetrics(selectedValue.value);
        navigate(`/subtitles/movie/${selectedValue.value}`);
      }}
      inputValue={inputValue}
      isLoading={isLoading}
      disabled={false}
      onClearInputValue={onClearInputValue}
    />
  );
}
