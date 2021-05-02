import CategoryThread from "./CategoryThread";
import { ThreadCategory } from "./ThreadCategory";
import { Thread } from "./Thread";

export const getTopCategories = async (): Promise<Array<CategoryThread>> => {
  const categories = await ThreadCategory.createQueryBuilder("threadCategory")
    .leftJoinAndSelect("threadCategory.threads", "thread")
    .getMany();

  const categoryThreads: Array<CategoryThread> = [];
  // sort categories in desc
  categories.sort((a: ThreadCategory, b: ThreadCategory) => {
    if (a.threads.length > b.threads.length) return -1;
    if (a.threads.length < b.threads.length) return 1;
    return 0;
  });

  const topCats = categories.slice(0, 3);
  // sort thread thread by creation date in desc

  topCats.forEach((cat) => {
    cat.threads.sort((a: Thread, b: Thread) => {
      if (a.createdOn > b.createdOn) return -1;
      if (a.createdOn < b.createdOn) return 1;
      return 0;
    });

    cat.threads.forEach((th) => {
      categoryThreads.push(
        new CategoryThread(th.id, cat.id, cat.name, th.title, th.createdOn)
      );
    });
  });

  return categoryThreads;
};
