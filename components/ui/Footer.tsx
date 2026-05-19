import { PortfolioData } from "@/types/portfolio";

export default function Footer({ data }: { data: PortfolioData["footer"] }) {
  return (
    <footer className="py-8 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">{data.text}</p>
        {data.links.length > 0 && (
          <nav className="flex gap-6">
            {data.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
