"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";

export function UploadButton({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-report", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        alert("Reporte PDF cargado exitosamente");
        onUploadSuccess();
      } else {
        alert("Error cargando el reporte");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="max-w-xs"
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file || loading}
        variant="outline"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {loading ? "Procesando" : "Subir PDF"}
      </Button>
    </div>
  );
}
