import { gql, useMutation } from "@apollo/client";

const UpdateThreadPoint = gql`
  mutation UpdateThreadItemPoint($threadId: ID!, $increment: Boolean!) {
    updateThreadPoint(threadId: $threadId, increment: $increment)
  }
`;

const useUpdateThreadPoint = (
  refreshThread?: () => void,
  updatingPoints?: () => void,
  threadId?: string
) => {
  const [execUpdateThreadPoint, { data: updatePointsMessage }] =
    useMutation(UpdateThreadPoint);

  const onClickIncThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: true,
      },
    });
    updatingPoints && updatingPoints();
    refreshThread && refreshThread();
  };

  const onClickDecThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: false,
      },
    });
    updatingPoints && updatingPoints();
    refreshThread && refreshThread();
  };

  return {
    onClickDecThreadPoint,
    onClickIncThreadPoint,
    updatePointsMessage,
  };
};

export default useUpdateThreadPoint;
