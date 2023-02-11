import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const POSTS: { id: number | string; title: string }[] = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

// /posts -> ["posts"]
// /posts/1 -> ["posts", post.id]
// /posts?authorId=1 -> ["posts", {authorId: 1}]
// /posts/1/comments -> ["posts", post.id, "comments"]

function App() {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: (obj) =>
      wait(1000).then(() => {
        console.log(obj);
        return [...POSTS];
      }),
    // queryFn: () => Promise.reject("Error message"),
  });

  const newPostMutation = useMutation({
    mutationFn: (title: string) =>
      wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), title })),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>Error : {JSON.stringify(postsQuery.error)}</pre>;

  return (
    <div>
      {postsQuery.data.map((post) => {
        return <div key={post.id}>{post.title}</div>;
      })}
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => {
          newPostMutation.mutate("New post");
        }}
      >
        Add new post
      </button>
    </div>
  );
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
