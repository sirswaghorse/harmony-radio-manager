
import { useState, useEffect } from "react";
import { Headphones, Link as LinkIcon, Rss, Plus, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type LinkType = "listen" | "stream" | "podcast" | "custom";
type LinkIcon = "headphones" | "link" | "rss" | "radio";

interface QuickLink {
  id: string;
  name: string;
  url: string;
  type: LinkType;
  icon: LinkIcon;
}

const DEFAULT_LINKS: QuickLink[] = [
  {
    id: "1",
    name: "Listen Live",
    url: "https://station.example.com/listen",
    type: "listen",
    icon: "headphones"
  },
  {
    id: "2",
    name: "Stream URL",
    url: "https://station.example.com/listen.m3u",
    type: "stream",
    icon: "link"
  },
  {
    id: "3",
    name: "Podcast Feed",
    url: "https://station.example.com/podcast",
    type: "podcast",
    icon: "rss"
  }
];

export default function QuickLinksPage() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load links from localStorage or use defaults
    const savedLinks = localStorage.getItem("harmony-quick-links");
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        setLinks(DEFAULT_LINKS);
      }
    } else {
      setLinks(DEFAULT_LINKS);
    }
  }, []);

  const saveLinks = (updatedLinks: QuickLink[]) => {
    localStorage.setItem("harmony-quick-links", JSON.stringify(updatedLinks));
    setLinks(updatedLinks);
    toast({
      title: "Quick links saved",
      description: "Your quick links have been updated.",
    });
  };

  const addNewLink = () => {
    const newLink: QuickLink = {
      id: Date.now().toString(),
      name: "New Link",
      url: "https://",
      type: "custom",
      icon: "link"
    };
    setLinks([...links, newLink]);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
  };

  const updateLink = (id: string, field: keyof QuickLink, value: string) => {
    const updatedLinks = links.map(link => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setLinks(updatedLinks);
  };

  const handleIconSelect = (id: string, value: string) => {
    updateLink(id, "icon", value as LinkIcon);
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "headphones":
        return <Headphones className="h-5 w-5" />;
      case "rss":
        return <Rss className="h-5 w-5" />;
      case "radio":
        return <Headphones className="h-5 w-5" />;
      case "link":
      default:
        return <LinkIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Quick Links</h1>
      <p className="text-muted-foreground mb-6">
        Configure links that will appear in the sidebar for quick access to your station's streams and resources.
      </p>

      <div className="grid gap-6">
        {links.map((link) => (
          <Card key={link.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center">
                {renderIcon(link.icon)}
                <span className="ml-2">Link Configuration</span>
              </CardTitle>
              <CardDescription>Configure this quick access link</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor={`icon-${link.id}`}>Icon</Label>
                    <Select 
                      value={link.icon} 
                      onValueChange={(value) => handleIconSelect(link.id, value)}
                    >
                      <SelectTrigger id={`icon-${link.id}`}>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="headphones">Headphones</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="rss">RSS</SelectItem>
                        <SelectItem value="radio">Radio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`name-${link.id}`}>Link Name</Label>
                    <Input 
                      id={`name-${link.id}`}
                      value={link.name}
                      onChange={(e) => updateLink(link.id, "name", e.target.value)} 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`url-${link.id}`}>URL</Label>
                  <Input 
                    id={`url-${link.id}`}
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)} 
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button onClick={addNewLink} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Link
          </Button>
          <Button onClick={() => saveLinks(links)}>
            <Save className="h-4 w-4 mr-2" />
            Save All Links
          </Button>
        </div>
      </div>
    </div>
  );
}
