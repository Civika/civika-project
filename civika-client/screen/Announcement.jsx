import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { Container, H1, Content, Button, Icon } from "native-base";
import AnnouncementList from "../components/AnnouncementList";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAnnouncement,
  SET_ANNOUNCEMENT,
  SET_ANNOUNCEMENT_LOADING,
} from "../store/action.js";
import FAB from "react-native-fab";
import db from "../configdb/index.js";

const { width } = Dimensions.get("window");

export default function AnnouncementScreen({ navigation }) {
  const dispatch = useDispatch();
  const dataUser = useSelector((state) => state.dataUser);
  const token = useSelector((state) => state.access_token);
  const announcements = useSelector((state) => state.announcements);
  const announcementsLoading = useSelector(
    (state) => state.announcementsLoading
  );
  const [update, setUpdate] = useState(0);

  function realtimeUpdate() {
    db.collection("announcement").onSnapshot((querySnapshot) => {
      setUpdate(querySnapshot.docChanges().length);
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          dispatch(fetchAnnouncement(token));
        }
        if (change.type === "modified") {
        }
        if (change.type === "removed") {
          dispatch(fetchAnnouncement(token));
        }
      });
    });
  }

  useEffect(() => {
    if (update === 1) {
      realtimeUpdate();
    } else {
      realtimeUpdate();
    }
    dispatch(fetchAnnouncement(token));
  }, [update]);

  return (
    <Container
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : null,
      }}
    >
      <H1 style={{ margin: 5 }}> Pengumuman </H1>
      <Content style={{ margin: 10 }}>
        {announcements.map((announcement, id) => {
          return (
            <AnnouncementList
              announcement={announcement}
              key={id}
              dataUser={dataUser}
            />
          );
        })}
      </Content>
      {dataUser.role === "teacher" ? (
        <FAB
          buttonColor="#112d4e"
          iconTextColor="#FFFFFF"
          onClickAction={() => {
            navigation.navigate("Pengumuman");
          }}
          visible={true}
          iconTextComponent={<Icon type="Entypo" name="plus" />}
        />
      ) : null}
    </Container>
  );
}
// }

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    width: 300,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
