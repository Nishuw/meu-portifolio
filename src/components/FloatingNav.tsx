import { Link, useLocation } from "react-router-dom";

const FloatingNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Projetos", path: "/" },
    { name: "Sobre", path: "/about" },
    { name: "Contato", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return (
        currentPath === "/" ||
        currentPath === "/index" ||
        currentPath === "/explore" ||
        currentPath.startsWith("/project")
      );
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-muted/80 backdrop-blur-md rounded-full p-1.5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            aria-current={isActive(item.path) ? "page" : undefined}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              isActive(item.path)
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default FloatingNav;
