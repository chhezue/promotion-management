"use client";

import {
  IconArrowUpRight,
  IconFile,
  IconSquarePlus,
  IconX,
  IconSearch,
} from "@tabler/icons-react";
import { axiosInstance } from "@/src/libs/axios";
import React, { useEffect, useState } from "react";
import {
  ISite,
  FileItem,
  GetRecentFiles,
  GetSites,
  CreateSiteRequest,
} from "@/src/interfaces/promotion-management";

const HomePage = () => {
  const [sites, setSites] = useState<ISite[]>([]);
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 최근 문서 불러오기
  const getRecentFiles = async () => {
    try {
      const { data } = await axiosInstance.get<GetRecentFiles>(
        "/promotion-management/node/recent-file"
      );
      const { result, nodes, msg } = data;

      if (result) {
        setRecentFiles(nodes);
      } else {
        console.error(msg || "최근 문서 불러오기 실패");
      }
    } catch (e) {
      console.error("최근 문서 에러:", e);
    }
  };

  // 홈페이지 불러오기
  const getSites = async () => {
    try {
      const timestamp = Date.now();
      const { data } = await axiosInstance.get<GetSites>(
        `/promotion-management/site?t=${timestamp}`
      );

      const { result, sites, msg } = data;
      if (result) {
        setSites(sites.slice(0, 8));
      } else {
        console.error(msg);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 검색
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await axiosInstance.get(
        `/promotion-management/node/search?keyword=${encodeURIComponent(searchKeyword)}`
      );
      const { result, nodes, msg } = data;

      if (result) {
        setSearchResults(nodes);
      } else {
        setSearchResults([]);
        console.error(msg);
      }
    } catch (e) {
      console.error("검색 에러:", e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Enter 키로 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    getSites();
    getRecentFiles();
  }, []);

  return (
    <div className="flex justify-center px-4 pt-8 sm:px-8 lg:px-16">
      <div className="flex w-full max-w-6xl flex-col">
        {/* 검색 섹션 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="파일 및 폴더 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
            />
            <IconSearch
              size={24}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-blue-500 px-4 py-1.5 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? "검색중..." : "검색"}
            </button>
          </div>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 text-lg font-semibold">검색 결과</h3>
              <div className="space-y-2">
                {searchResults.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <IconFile size={20} className="text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.category === "file" ? "파일" : "폴더"} • {" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 홈페이지 바로가기 */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-2xl font-bold">
            홈페이지 바로가기
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sites.map((item) => (
              <button
                key={item._id}
                onClick={() => window.open(item.url, "_blank")}
                className="flex h-24 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left shadow-sm transition-all hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </div>
                </div>
                <IconArrowUpRight
                  size={20}
                  className="ml-2 text-gray-400 dark:text-gray-500"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 최근 문서 */}
        <div className="mb-8">
          <div className="mb-4 text-2xl font-bold">최근 문서</div>

          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentFiles.map((doc) => (
                <div
                  key={doc._id}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-3">
                    <IconFile size={24} className="text-blue-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <IconFile size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">
                최근 업로드된 문서가 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 파일 관리 버튼 */}
        <div className="text-center">
          <a
            href="/files"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 transition-colors"
          >
            <IconFile size={20} />
            파일 관리하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 