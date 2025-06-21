"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/src/libs/axios";
import { FileItem, GetFileItems } from "@/src/interfaces/promotion-management";
import {
  IconFolder,
  IconFile,
  IconDownload,
  IconTrash,
  IconEdit,
  IconCopy,
  IconPlus,
} from "@tabler/icons-react";

const FilesPage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // 파일 목록 가져오기
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<GetFileItems>(
        "/promotion-management/node"
      );
      
      if (data.result) {
        setFiles(data.nodes);
      }
    } catch (error) {
      console.error("파일 목록을 가져오는 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 파일 다운로드
  const handleDownload = async (item: FileItem) => {
    if (item.category === "file" && item.fileUrl) {
      try {
        const response = await fetch(item.fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("다운로드 중 오류:", error);
      }
    }
  };

  // 파일 삭제
  const handleDelete = async (item: FileItem) => {
    if (confirm(`"${item.name}"을(를) 삭제하시겠습니까?`)) {
      try {
        await axiosInstance.delete(`/promotion-management/node/${item._id}`);
        await fetchFiles(); // 목록 새로고침
      } catch (error) {
        console.error("삭제 중 오류:", error);
      }
    }
  };

  // 폴더 생성
  const handleCreateFolder = async () => {
    const name = prompt("새 폴더 이름을 입력하세요:");
    if (name) {
      try {
        await axiosInstance.post("/promotion-management/node/directory", {
          name,
        });
        await fetchFiles(); // 목록 새로고침
      } catch (error) {
        console.error("폴더 생성 중 오류:", error);
      }
    }
  };

  // 파일 업로드
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axiosInstance.post("/promotion-management/node/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchFiles(); // 목록 새로고침
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
    }
  };

  // 아이템 선택/해제
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  // 파일 아이콘 반환
  const getFileIcon = (item: FileItem) => {
    if (item.category === "directory") {
      return <IconFolder size={24} className="text-blue-500" />;
    }
    return <IconFile size={24} className="text-gray-500" />;
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">파일 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">파일 관리</h1>
        
        <div className="flex gap-2">
          <button
            onClick={handleCreateFolder}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <IconPlus size={20} />
            새 폴더
          </button>
          
          <label className="flex items-center gap-2 cursor-pointer rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            <IconPlus size={20} />
            파일 업로드
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
          </label>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <IconFolder size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">파일이 없습니다.</p>
          <p className="text-gray-400">새 폴더를 만들거나 파일을 업로드해보세요.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === files.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(new Set(files.map(f => f._id)));
                      } else {
                        setSelectedItems(new Set());
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  크기
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수정일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item._id)}
                      onChange={() => toggleSelection(item._id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(item)}
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {item.category === "file" && (
                        <button
                          onClick={() => handleDownload(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="다운로드"
                        >
                          <IconDownload size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-900"
                        title="삭제"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilesPage; 