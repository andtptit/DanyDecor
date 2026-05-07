import { Palette, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-soft-gray border-t border-gray-100 py-16">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Palette className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl text-dark tracking-tight">
            Dany<span className="text-primary">Decor</span>
          </span>
        </div>
        <div className="text-gray-400 text-xs uppercase tracking-widest font-bold text-center md:text-left">
          © {new Date().getFullYear()} DanyDecor · Crafted with Passion
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-dark hover:text-primary transition-colors"
            aria-label="Contact"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-dark hover:text-primary transition-colors"
            aria-label="Website"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
