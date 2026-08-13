import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Bookmark02Icon, FolderIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppSidebar from "@/components/layout/AppSidebar";
import CodePassage from "@/features/quiz/components/practice/CodePassage";
import {
  createBookmarkGroupApi,
  deleteBookmarkApi,
  deleteBookmarkGroupApi,
  fetchBookmarkGroupsApi,
  fetchBookmarkedQuestionsApi,
} from "@/features/api/bookmarkApi";
import type { BookmarkGroupDto, BookmarkedQuestionDto } from "@/features/api/bookmarkApi";

export const BookmarkManagementPage: React.FC = () => {
  const [groups, setGroups] = useState<BookmarkGroupDto[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  const fetchBookmarkData = async () => {
    setLoading(true);
    try {
      const [groupsRes, bookmarksRes] = await Promise.all([
        fetchBookmarkGroupsApi().catch(() => []),
        fetchBookmarkedQuestionsApi().catch(() => []),
      ]);
      setGroups(groupsRes || []);
      setBookmarks(bookmarksRes || []);
    } catch (err) {
      console.error("Failed to fetch bookmarks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkData();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await createBookmarkGroupApi(newGroupName.trim(), newGroupDesc.trim());
      setNewGroupName("");
      setNewGroupDesc("");
      fetchBookmarkData();
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("이 책갈피 그룹을 삭제하시겠습니까?")) return;
    try {
      await deleteBookmarkGroupApi(groupId);
      if (selectedGroupId === groupId) setSelectedGroupId(null);
      fetchBookmarkData();
    } catch (err) {
      console.error("Failed to delete group", err);
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      await deleteBookmarkApi(bookmarkId);
      fetchBookmarkData();
    } catch (err) {
      console.error("Failed to delete bookmark", err);
    }
  };

  const filteredBookmarks = selectedGroupId
    ? bookmarks.filter((b) => b.groupId === selectedGroupId)
    : bookmarks;

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <HugeiconsIcon icon={Bookmark02Icon} className="h-7 w-7 text-indigo-600" />
              책갈피 (북마크) GUI 관리
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              선호하는 퀴즈 문제를 책갈피 그룹/폴더로 자유롭게 분류하고 저장할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/v1/export/markdown${selectedGroupId ? `?groupId=${selectedGroupId}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              📥 Markdown 다운로드
            </a>
            <a
              href={`/api/v1/export/html${selectedGroupId ? `?groupId=${selectedGroupId}` : ''}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-xs"
            >
              🖨️ 인쇄 / PDF 보기
            </a>
            <Badge className="border-0 bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 text-xs">
              총 {bookmarks.length}개 책갈피 문제
            </Badge>
          </div>
        </div>

        {/* Group Management Section */}
        <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <HugeiconsIcon icon={FolderIcon} className="h-5 w-5 text-indigo-600" />
              책갈피 그룹 폴더 ({groups.length})
            </h2>

            {/* Create New Group Form */}
            <form onSubmit={handleCreateGroup} className="flex flex-wrap items-center gap-2">
              <Input
                type="text"
                placeholder="새 그룹/폴더명 (예: Spring 보안)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="h-9 w-44 rounded-xl border-slate-200 text-xs font-semibold focus-visible:ring-indigo-500/20"
              />
              <Input
                type="text"
                placeholder="설명 (선택)"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="h-9 w-40 rounded-xl border-slate-200 text-xs font-medium focus-visible:ring-indigo-500/20 hidden sm:block"
              />
              <button
                type="submit"
                disabled={!newGroupName.trim()}
                className="flex h-9 items-center gap-1 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
                폴더 생성
              </button>
            </form>
          </div>

          {/* Group Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroupId(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedGroupId === null
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              전체 보기 ({bookmarks.length})
            </button>
            {groups.map((g) => (
              <div key={g.id} className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedGroupId === g.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-indigo-50/80 text-indigo-900 border-indigo-100 hover:bg-indigo-100"
                  }`}
                >
                  📁 {g.name} ({g.count || 0})
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteGroup(g.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  title="폴더 삭제"
                >
                  <HugeiconsIcon icon={Delete01Icon} className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Bookmarked Questions List */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-slate-100 shadow-xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs font-bold text-slate-400">책갈피 문제를 불러오고 있습니다...</p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <Card className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xs">
            <CardContent className="p-0">
              <p className="text-base font-extrabold text-slate-900">저장된 책갈피 문제가 없습니다</p>
              <p className="mt-1 text-xs text-slate-500">퀴즈 풀이 중 ⭐ 아이콘을 누르면 원하는 문제만 따로 모아 둘 수 있습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.map((bm) => {
              let parsedQ: any = {};
              try {
                parsedQ = JSON.parse(bm.questionJson || "{}");
              } catch {}

              return (
                <Card
                  key={bm.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge className="border-0 bg-amber-50 text-amber-700 font-extrabold text-xs">
                        ⭐ {bm.targetWord || bm.questionType || "책갈피"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleDeleteBookmark(bm.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="책갈피 해제"
                      >
                        <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {bm.prompt || parsedQ.prompt || "문제"}
                    </h3>
                    {parsedQ.passage && (
                      <CodePassage passage={parsedQ.passage} targetWord={bm.targetWord} isCodeType />
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                    <p className="truncate">정답: {parsedQ.correct_choice_id || parsedQ.correct_text || "-"}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppSidebar>
  );
};

export default BookmarkManagementPage;
