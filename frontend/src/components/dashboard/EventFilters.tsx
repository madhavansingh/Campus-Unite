import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Code, Palette, Briefcase, Users, Lightbulb, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories = [
  { id: "all", label: "All Events", icon: null },
  { id: "tech", label: "Technology", icon: Code },
  { id: "design", label: "Design", icon: Palette },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "social", label: "Social", icon: Users },
  { id: "workshop", label: "Workshop", icon: Lightbulb },
  { id: "cultural", label: "Cultural", icon: Music },
];

const EventFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange 
}: EventFiltersProps) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search events, topics, or venues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-14 rounded-2xl text-lg shadow-card"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          
          return (
            <Button
              key={cat.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                rounded-xl px-6 py-6 font-medium whitespace-nowrap
                ${isSelected ? "gradient-primary shadow-glow" : "hover:scale-105"}
                transition-all duration-200
              `}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* Active Filters Badge */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="rounded-lg">
              {categories.find(c => c.id === selectedCategory)?.label}
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="rounded-lg">
              Search: {searchQuery}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCategoryChange("all");
              onSearchChange("");
            }}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
