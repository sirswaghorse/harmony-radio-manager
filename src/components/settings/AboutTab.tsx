
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Coffee, Heart, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AboutTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Harmony</CardTitle>
        <CardDescription>
          Information about Harmony Icecast Manager and its creator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="rounded-lg overflow-hidden border shadow-md">
              <img 
                src="/lovable-uploads/6c4ffce6-d8d6-4ff2-a7ca-968468e4e1ed.png" 
                alt="Jonah the Goo Boy" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h3 className="text-2xl font-bold text-purple-600">Jonah the Goo Boy</h3>
            <p className="text-muted-foreground">
              Creator & Lead Developer
            </p>
            <p>
              Jonah is a passionate developer with a love for music and radio broadcasting. 
              The Harmony Icecast Manager was created to make internet radio management 
              accessible to everyone, combining powerful features with an intuitive interface.
            </p>
            <p>
              When not coding, Jonah enjoys creating music, gaming, and exploring new technologies.
            </p>
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium">About Harmony Icecast Manager</h3>
          <p>
            Harmony is a modern, open-source management interface for Icecast servers. 
            It was designed to simplify the process of running an internet radio station
            while providing powerful tools for DJs and station managers.
          </p>
          
          <h4 className="text-lg font-medium mt-4">Key Features:</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Easy-to-use admin interface</li>
            <li>DJ management system</li>
            <li>Built-in broadcasting capabilities</li>
            <li>Auto DJ integration</li>
            <li>Song request management</li>
            <li>Customizable widgets for your website</li>
            <li>Comprehensive statistics and analytics</li>
          </ul>
        </div>

        <Separator />
        
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="https://github.com/sirswaghorse" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="https://www.jonahthegoodra.site/" target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
              Website
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="mailto:jonah@example.com">
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-amber-600 border-amber-600 hover:bg-amber-50 hover:text-amber-700" asChild>
            <a href="https://buymeacoffee.com/jonahgoodra" target="_blank" rel="noopener noreferrer">
              <Coffee className="h-4 w-4" />
              Buy me a coffee
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" asChild>
            <a href="https://patreon.com/example" target="_blank" rel="noopener noreferrer">
              <Heart className="h-4 w-4" />
              Support on Patreon
            </a>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Harmony Icecast Manager v1.0.0</p>
          <p>© 2025 Jonah the Goodra. All rights reserved.</p>
        </div>
      </CardContent>
    </Card>
  );
}
