import { fetchApi } from "@/lib/apiClient";

export interface BookmarkGroupDto {
  id: string;
  name: string;
  description?: string;
  color?: string;
  count?: number;
}

export interface BookmarkedQuestionDto {
  id: string;
  groupId?: string;
  questionId: string;
  questionType?: string;
  targetWord?: string;
  prompt?: string;
  questionJson: string;
  answerKeyJson?: string;
}

export const fetchBookmarkGroupsApi = async (): Promise<BookmarkGroupDto[]> => {
  return fetchApi<BookmarkGroupDto[]>("/api/bookmarks/groups");
};

export const createBookmarkGroupApi = async (name: string, description?: string, color?: string): Promise<BookmarkGroupDto> => {
  return fetchApi<BookmarkGroupDto>("/api/bookmarks/groups", {
    method: "POST",
    body: JSON.stringify({ name, description, color }),
  });
};

export const deleteBookmarkGroupApi = async (groupId: string): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/api/bookmarks/groups/${groupId}`, {
    method: "DELETE",
  });
};

export const fetchBookmarkedQuestionsApi = async (groupId?: string): Promise<BookmarkedQuestionDto[]> => {
  const url = groupId ? `/api/bookmarks?groupId=${groupId}` : "/api/bookmarks";
  return fetchApi<BookmarkedQuestionDto[]>(url);
};

export const deleteBookmarkApi = async (bookmarkId: string): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/api/bookmarks/${bookmarkId}`, {
    method: "DELETE",
  });
};
