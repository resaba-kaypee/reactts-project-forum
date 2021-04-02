import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ThreadModel from "../../../models/Thread";
import ThreadHeader from "./ThreadHeader";
import Nav from "../../areas/Nav";
import { getThreadById } from "../../../services/DataService";
import "./Thread.css";
import ThreadCategory from "./ThreadCategory";
import ThreadTitle from "./ThreadTitle";

const Thread = () => {
  const [thread, setThread] = useState<ThreadModel | undefined>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log("Thread id: ", id);
    if (id && Number(id) > 0) {
      getThreadById(id).then((th) => {
        setThread(th);
      });
    }
  }, [id]);

  return (
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <div className="thread-content-container">
        <div className="thread-content-post-container">
          <ThreadHeader
            userName={thread?.userName}
            lastModifiedOn={thread ? thread.lastModifiedOn : new Date()}
            title={thread?.title}
          />
          <ThreadCategory categoryName={thread?.category?.name} />
          <ThreadTitle title={thread?.title} />
        </div>
      </div>
    </div>
  );
};

export default Thread;
