import { useState } from "react";
import { useRadio } from "@/contexts/RadioContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Edit, Plus, Radio, Trash2, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DJConnectionSettings } from "@/components/djs/DJConnectionSettings";
import { DJConnectionInstructions } from "@/components/djs/DJConnectionInstructions";

interface DJ {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  isOnAir: boolean;
}

interface DialogData {
  isOpen: boolean;
  mode: "add" | "edit";
  dj: DJ | null;
}

const defaultDJ: DJ = {
  id: "",
  name: "",
  avatar: "/placeholder.svg",
  bio: "",
  isOnAir: false,
};

const DJsPage = () => {
  const { djs, updateDJs } = useRadio();
  const [dialogData, setDialogData] = useState<DialogData>({
    isOpen: false,
    mode: "add",
    dj: null,
  });
  const [formData, setFormData] = useState<DJ>(defaultDJ);
  const [activeTab, setActiveTab] = useState<string>("dj-list");

  const openAddDialog = () => {
    setFormData(defaultDJ);
    setDialogData({
      isOpen: true,
      mode: "add",
      dj: null,
    });
  };

  const openEditDialog = (dj: DJ) => {
    setFormData({ ...dj });
    setDialogData({
      isOpen: true,
      mode: "edit",
      dj,
    });
  };

  const closeDialog = () => {
    setDialogData({ ...dialogData, isOpen: false });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isOnAir: checked }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a DJ name");
      return;
    }

    let newDJs: DJ[];

    if (dialogData.mode === "add") {
      const newDJ = {
        ...formData,
        id: `dj${Date.now()}`,
      };
      
      if (newDJ.isOnAir) {
        newDJs = djs.map(dj => ({ ...dj, isOnAir: false }));
      } else {
        newDJs = [...djs];
      }
      
      newDJs.push(newDJ);
      toast.success(`DJ ${newDJ.name} added successfully`);
    } else {
      if (formData.isOnAir) {
        newDJs = djs.map(dj => ({
          ...dj,
          isOnAir: dj.id === formData.id,
        }));
      } else {
        newDJs = djs.map(dj => (dj.id === formData.id ? formData : dj));
      }
      toast.success(`DJ ${formData.name} updated successfully`);
    }

    updateDJs(newDJs);
    closeDialog();
  };

  const handleDelete = (id: string) => {
    const djToDelete = djs.find(dj => dj.id === id);
    if (!djToDelete) return;
    
    const newDJs = djs.filter(dj => dj.id !== id);
    updateDJs(newDJs);
    toast.success(`DJ ${djToDelete.name} removed successfully`);
  };

  const setDJOnAir = (id: string) => {
    const newDJs = djs.map(dj => ({
      ...dj,
      isOnAir: dj.id === id,
    }));
    
    updateDJs(newDJs);
    const djName = djs.find(dj => dj.id === id)?.name;
    toast.success(`${djName} is now on air`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">DJs Management</h1>
        <Button onClick={openAddDialog}>
          <Plus size={16} className="mr-2" />
          Add DJ
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dj-list">DJ List</TabsTrigger>
          <TabsTrigger value="connection-settings">Connection Settings</TabsTrigger>
          <TabsTrigger value="instructions">Connection Instructions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dj-list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {djs.map(dj => (
              <Card key={dj.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{dj.name}</CardTitle>
                    {dj.isOnAir && (
                      <Badge className="bg-harmony-primary">
                        <Radio size={14} className="mr-1" /> On Air
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {dj.avatar ? (
                        <img src={dj.avatar} alt={dj.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck size={24} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      {dj.bio ? (
                        <p className="text-sm text-muted-foreground line-clamp-3">{dj.bio}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No bio available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <div className="flex justify-between w-full">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(dj.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(dj)}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button 
                        variant={dj.isOnAir ? "secondary" : "default"} 
                        size="sm" 
                        onClick={() => setDJOnAir(dj.id)}
                        disabled={dj.isOnAir}
                      >
                        <Radio size={14} className="mr-1" /> 
                        {dj.isOnAir ? "On Air" : "Set On Air"}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="connection-settings">
          <DJConnectionSettings />
        </TabsContent>
        
        <TabsContent value="instructions">
          <DJConnectionInstructions />
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit DJ Dialog */}
      <Dialog open={dialogData.isOpen} onOpenChange={isOpen => !isOpen && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogData.mode === "add" ? "Add New DJ" : `Edit DJ: ${dialogData.dj?.name}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name} 
                onChange={handleFormChange}
                placeholder="DJ Name" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input 
                id="avatar"
                name="avatar"
                value={formData.avatar || ""} 
                onChange={handleFormChange}
                placeholder="https://example.com/avatar.jpg" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                name="bio"
                value={formData.bio || ""} 
                onChange={handleFormChange}
                placeholder="DJ Bio" 
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isOnAir"
                checked={formData.isOnAir}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isOnAir">Set as currently on air</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {dialogData.mode === "add" ? "Add DJ" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DJsPage;
