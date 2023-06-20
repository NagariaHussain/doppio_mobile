import { Layout, Input, Text, Card, Spinner } from "@ui-kitten/components";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/auth";
import Toast from 'react-native-toast-message';
import { FlashList } from "@shopify/flash-list";
import { useFrappe } from "../provider/backend";


const TodoItem = ({ item }) => {
  return (
    <Card key={item.name} style={{ width: "100%", marginBottom: 10 }}>
      <Text>{item.description}</Text>
    </Card>
  );
};

export const TodoScreen = () => {
  const { accessToken, refreshAccessTokenAsync } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [todo, setTodo] = useState("");
  const { db } = useFrappe()

  useEffect(() => {
    fetchTodos();
  }, [accessToken]);

  function fetchTodos() {
    setLoadingTodos(true);
    db.getDocList("ToDo", { fields: ["name", "description"], orderBy: { field: "creation", order: "desc" } })
      .then((res) => {
        setTodos(res);
      })
      .catch(async (e) => {
        // This needs to be handled better, at a common place (DONE)
        if (e.httpStatus === 403) {
          // refresh token
          await refreshAccessTokenAsync();
        }
      })
      .finally(() => {
        setLoadingTodos(false);
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

          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Success',
            text2: 'Todo added successfully'
          });
        }}
        onChangeText={(nextValue) => setTodo(nextValue)}
        placeholder="What needs to be done?"
        style={{ marginBottom: 20 }}
      />

      {!loadingTodos &&
        <Layout style={{ width: "100%", height: "100%" }}>
          <FlashList
            data={todos}
            renderItem={TodoItem}
            estimatedItemSize={100}
            onRefresh={fetchTodos}
            refreshing={loadingTodos}
          />
        </Layout>
      }

      {loadingTodos && (
        <Layout style={{ marginTop: 50 }}>
          <Spinner />
        </Layout>
      )}
    </Layout>
  );
};
