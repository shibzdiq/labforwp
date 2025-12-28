import React, { useEffect, useState } from "react";
import { UploadsApi } from "../../features/uploads/api/uploads.api";
import  Button  from "../../shared/ui/Button";
import  Table  from "../../shared/ui/Table";
import  Loader  from "../../shared/ui/Loader";
import { MetaTags } from "../../app/seo/MetaTags";

interface UploadFile {
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
}

const FilesManager: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await UploadsApi.getFiles();
      setFiles(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (name: string) => {
    if (!confirm("Видалити файл?")) return;
    await UploadsApi.deleteFile(name);
    loadFiles();
  };

  return (
    <>
      <MetaTags title="Адмін — Файли" />
      <h1 className="text-2xl font-bold text-gold-300 mb-6">Файловий менеджер</h1>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {!loading && files.length === 0 && (
        <div className="text-gray-400">Файлів поки немає.</div>
      )}

      {files.length > 0 && (
        <Table
          head={["Назва", "Розмір", "Дата", "Дії"]}
          rows={files.map((f) => [
            <a
              key={f.name}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="text-gold-300 underline"
            >
              {f.name}
            </a>,
            f.size ? `${(f.size / 1024).toFixed(1)} KB` : "—",
            f.createdAt
              ? new Date(f.createdAt).toLocaleString("uk-UA")
              : "—",
            <Button
              key={f.name}
              size="sm"
              variant="danger"
              onClick={() => handleDelete(f.name)}
            >
              Видалити
            </Button>,
          ])}
        />
      )}
    </>
  );
};

export default FilesManager;
