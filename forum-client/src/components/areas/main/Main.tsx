import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";
import { AppState } from "../../../store/AppState";
import { useSelector } from "react-redux";
import MainHeader from "./MainHeader";
import ThreadCard from "./ThreadCard";
import Category from "../../../models/Category";

const GetThreadsByCategoryId = gql`
  query getThreadsByCategoryId($categoryId: ID!) {
    getThreadsByCategoryId(categoryId: $categoryId) {
      ... on EntityResult {
        messages
      }

      ... on ThreadArray {
        threads {
          id
          title
          body
          views
          points
          user {
            userName
          }
          threadItems {
            id
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const GetThreadsLatest = gql`
  query getThreadsLatest {
    getThreadsLatest {
      ... on EntityResult {
        messages
      }

      ... on ThreadArray {
        threads {
          id
          title
          body
          views
          points
          user {
            userName
          }
          threadItems {
            id
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const Main = () => {
  const [
    execGetThreadsByCat,
    {
      //error: threadsByCatErr,
      //called: threadsByCatCalled,
      data: threadsByCatData,
    },
  ] = useLazyQuery(GetThreadsByCategoryId);
  const [
    execGetThreadsLatest,
    {
      //error: threadsLatestErr,
      //called: threadsLatestCalled,
      data: threadsLatestData,
    },
  ] = useLazyQuery(GetThreadsLatest, { fetchPolicy: "no-cache" });

  const user = useSelector((state: AppState) => state.user);
  const [msg, setMsg] = useState("Write a new topic");
  const [style, setStyle] = useState("action-btn");
  const [onReset, setOnReset] = useState(false);

  const { categoryId } = useParams<any>();

  const [category, setCategory] = useState<Category | undefined>();
  const [threadCards, setThreadCards] = useState<Array<JSX.Element> | null>(
    null
  );

  const history = useHistory();

  useEffect(() => {
    if (categoryId && categoryId > 0) {
      execGetThreadsByCat({
        variables: {
          categoryId,
        },
      });
    } else {
      execGetThreadsLatest();
    }
    // eslint-disable-next-line
  }, [categoryId]);

  useEffect(() => {
    if (
      threadsByCatData &&
      threadsByCatData.getThreadsByCategoryId &&
      threadsByCatData.getThreadsByCategoryId.threads
    ) {
      const threads = threadsByCatData.getThreadsByCategoryId.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th} />;
      });

      setCategory(threads[0].category);
      setThreadCards(cards);
    } else {
      setCategory(undefined);
      setThreadCards(null);
    }
  }, [threadsByCatData]);

  useEffect(() => {
    if (
      threadsLatestData &&
      threadsLatestData.getThreadsLatest &&
      threadsLatestData.getThreadsLatest.threads
    ) {
      const threads = threadsLatestData.getThreadsLatest.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th} />;
      });

      setCategory(new Category("0", "Latest"));
      setThreadCards(cards);
    }
  }, [threadsLatestData]);

  useEffect(() => {
    let timeOut: any;

    if (onReset) {
      setTimeout(() => {
        setMsg("Write a new topic");
        setStyle("action-btn");
        setOnReset(false);
      }, 2000);
    }
    return () => clearTimeout(timeOut);
  }, [onReset]);

  const onClickPostThread = () => {
    if (user && user.id !== "0") {
      history.push("/thread");
    }

    setStyle("warning");
    setMsg("You must be logged in to write a topic!");
    setOnReset(true);
  };

  return (
    <main className="content">
      <button className={style} onClick={onClickPostThread}>
        {msg}
      </button>
      <MainHeader category={category} />
      <div>{threadCards}</div>
    </main>
  );
};

export default Main;
