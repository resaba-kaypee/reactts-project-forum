import { gql, useMutation } from "@apollo/client";

const UpdateThreadPoint = gql`
  mutation UpdateThreadItemPoint($threadId: ID!, $increment: Boolean!) {
    updateThreadPoint(threadId: $threadId, increment: $increment)
  }
`;

const useUpdateThreadPoint = (
  refreshThread?: () => void,
  updatePoints?: () => void,
  threadId?: string
) => {
  const [execUpdateThreadPoint] = useMutation(UpdateThreadPoint);

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

    updatePoints && updatePoints();
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

    updatePoints && updatePoints();
    refreshThread && refreshThread();
  };

  return {
    onClickDecThreadPoint,
    onClickIncThreadPoint,
  };
};

export default useUpdateThreadPoint;
