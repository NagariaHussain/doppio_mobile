import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import styled from 'styled-components/native'
import { Layout, Text, Button } from "@ui-kitten/components";
import { AuthContext } from "../provider/auth";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image"
import uploadFile from "../utils/fileUploader";
import { useFrappe } from "../provider/backend";
import { CircularProgressBar } from '@ui-kitten/components';

const LogoutButton = styled(Button)`
  border-radius: 6px;
`

const ProfileImage = styled(Image)`
  width: 120px; 
  height: 120px;
  border-radius: 9999px;
`

export const DetailsScreen = () => {
  const { isAuthenticated, logout, userInfo, accessToken, fetchUserInfo } = useContext(AuthContext);
  const { db } = useFrappe();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Layout style={{ marginVertical: 20, position: "relative" }}>
          <ProfileImage source={{
            uri: userInfo.picture, headers: {
              Authorization: `Bearer ${accessToken}` // for handling private images
            }
          }} contentFit="cover" />

          {loading && <CircularProgressBar style={{ position: "absolute", top: 30, left: 30, backgroundColor: "white" }} progress={uploadProgress} />}
        </Layout>

        <Button appearance="ghost" onPress={async () => {
          // implement change profile pic
          // let the user pick image from gallery
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          })

          if (!result.canceled) {
            try {
              setLoading(true)
              await uploadFile(result.assets[0].uri, result.assets[0].uri.split('/').pop(), result.assets[0].type, {
                accessToken: accessToken,
                onUploadProgress: (progressEvent) => {
                  let progress = (progressEvent.loaded / progressEvent.total) * 100
                  setUploadProgress(progress);
                },
                onUploadComplete: async (data) => {
                  const fileUrl = data.message.file_url
                  await db.updateDoc("User", userInfo.email, {
                    user_image: fileUrl
                  })
                  await fetchUserInfo()
                  setLoading(false)
                },
                isPrivate: false,
                doctype: "User",
                docname: userInfo.email,
                fieldname: "user_image"
              })
            } catch (error) {
              console.log(error)
              setLoading(false)
            }

          }
        }}>Change Profile Pic</Button>

        <Layout style={{ marginVertical: 20 }}></Layout>

        <Text category="h4">{isAuthenticated ? userInfo.name : "Not Logged In"}</Text>
        {isAuthenticated && (
          <LogoutButton
            onPress={() => {
              logout();
            }}
          >
            Logout
          </LogoutButton>
        )}
      </Layout>
    </SafeAreaView >
  );
};
