import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Scale, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sections, articles, getArticlesBySection, searchArticles, Article, Section } from "@/data/penalCode";
import logo from "@/assets/logo.png";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchArticles(searchQuery);
  }, [searchQuery]);

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    setSelectedSection(sectionId);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const displayArticles = searchQuery.trim() ? searchResults : 
    selectedSection ? getArticlesBySection(selectedSection) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">
                CÓDIGO PENAL MILITAR
              </h1>
              <p className="text-sm text-muted-foreground tracking-widest uppercase">
                Roleplay • 500 Artigos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="border-b border-border bg-secondary/50 sticky top-[97px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar por artigo, palavra-chave ou número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border focus:ring-primary"
            />
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {searchResults.length} resultado(s) encontrado(s)
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar - Sections */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-[180px]">
              <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Seções
              </h2>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 hover:bg-accent ${
                          selectedSection === section.id ? "bg-accent text-accent-foreground" : ""
                        }`}
                      >
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <span className="line-clamp-2">{section.title}</span>
                      </button>
                      {expandedSections.has(section.id) && (
                        <p className="text-xs text-muted-foreground px-9 pb-2">
                          {section.description}
                        </p>
                      )}
                    </div>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 xl:col-span-9">
            {selectedArticle ? (
              /* Article Detail View */
              <div className="bg-card border border-border rounded-lg p-6 animate-fade-in">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar à lista
                </button>
                <div className="border-b border-border pb-4 mb-6">
                  <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium mb-3">
                    Artigo {selectedArticle.id}
                  </span>
                  <h2 className="text-2xl font-serif font-bold">{selectedArticle.title}</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Descrição
                    </h3>
                    <p className="text-lg leading-relaxed">{selectedArticle.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Penalidade
                    </h3>
                    <p className="text-lg font-medium text-primary bg-secondary px-4 py-3 rounded-lg">
                      {selectedArticle.penalty}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Palavras-chave
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Article List */
              <div className="space-y-4">
                {!searchQuery && !selectedSection && (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-serif font-semibold mb-2">
                      Código Penal Militar RP
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Selecione uma seção à esquerda ou use a barra de pesquisa para encontrar artigos específicos.
                    </p>
                  </div>
                )}

                {displayArticles.length > 0 && (
                  <div className="grid gap-3">
                    {displayArticles.map((article, index) => (
                      <button
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="w-full text-left bg-card border border-border rounded-lg p-4 hover:bg-accent transition-all duration-200 animate-fade-in group"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium">
                                Art. {article.id}
                              </span>
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {article.title}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {article.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                      Nenhum artigo encontrado para "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Código Penal Militar • Uso exclusivo para Roleplay</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
