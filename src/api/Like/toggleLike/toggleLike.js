import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      const { postId } = args;
      const { user } = request;
      const filterOptions = {
        AND: [
          {
            user: {
              id: user.id
            },
            post: {
              id: postId
            }
          }
        ]
      };
      try {
        // 로그인한 사람이 게시글에 좋아요를 눌렀으면
        const existingLike = await prisma.$exists.like(filterOptions);
        if (existingLike) {
          // 좋아요 자체를 찾고 삭제
          await prisma.deleteManyLikes(filterOptions);
        } else {
          // 문서(게시글)에 좋아요가 없었으면
          await prisma.createLike({
            user: {
              //User 필드와 관계설정
              connect: {
                id: user.id
              }
            },
            post: {
              connect: {
                id: postId
              }
            }
          });
        }

        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
