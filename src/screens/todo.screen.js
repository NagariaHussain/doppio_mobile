import { Layout, Input, Text, Card } from "@ui-kitten/components";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/auth";
import { BASE_URI } from "../data/constants";
import { FrappeApp } from "frappe-js-sdk";
export const TodoScreen = () => {
  const { accessToken, refreshAccessTokenAsync } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  const frappe = new FrappeApp(BASE_URI, {
    useToken: true,
    type: "Bearer",
    token: () => accessToken,
  });
  const db = frappe.db();

  useEffect(() => {
    fetchTodos();
  }, [accessToken]);

  function fetchTodos() {
    db.getDocList("ToDo", { fields: ["name", "description"] })
      .then((res) => {
        setTodos(res);
      })
      .catch(async (e) => {
        // This needs to be handled better, at a common place
        if (e.httpStatus === 403) {
          // refresh token
          await refreshAccessTokenAsync();
        }
      });
  }

  return (
    <Layout
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <Input
        value={todo}
        onSubmitEditing={() => {
          db.createDoc("ToDo", { description: todo }).then((res) => {
            setTodo("");
            fetchTodos();
          });
        }}
        onChangeText={(nextValue) => setTodo(nextValue)}
        placeholder="What needs to be done?"
        style={{ marginBottom: 20 }}
      />

      {todos.map((todo) => (
        <Card key={todo.name} style={{ width: "100%", marginBottom: 10 }}>
          <Text>{todo.description}</Text>
        </Card>
      ))}
    </Layout>
  );
};
