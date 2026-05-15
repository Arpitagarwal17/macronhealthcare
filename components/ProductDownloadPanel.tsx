import { productDownloads } from "@/data/downloads";

type ProductDownloadPanelProps = {
  compact?: boolean;
};

export default function ProductDownloadPanel({
  compact = false,
}: ProductDownloadPanelProps) {
  const downloads = [productDownloads.productCard, productDownloads.productList];

  return (
    <div
      className={`rounded-[1.1rem] border border-line bg-white shadow-soft ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {downloads.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-[0.9rem] border border-line bg-paper/70 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              <span className="field-label block text-blue">{item.label}</span>
            </span>
            <a
              href={item.href}
              download={item.fileName}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue px-5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/15"
            >
              {item.buttonLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
