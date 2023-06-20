import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import styled from 'styled-components/native'
import { Layout, Text, Button, Divider } from "@ui-kitten/components";
import { AuthContext } from "../provider/auth";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image"
import uploadFile from "../utils/fileUploader";

const LogoutButton = styled(Button)`
  border-radius: 6px;
`

const ProfileImage = styled(Image)`
  width: 120px; 
  height: 120px;
  border-radius: 100%;
`

export const DetailsScreen = () => {
  const { isAuthenticated, logout, userInfo, accessToken, fetchUserInfo } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >


        <ProfileImage source={{
          uri: userInfo.picture, headers: {
            Authorization: `Bearer ${accessToken}` // for handling private images
          }
        }} contentFit="cover" />
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
              await uploadFile(result.assets[0].uri, result.assets[0].uri.split('/').pop(), result.assets[0].type, {
                accessToken: accessToken,
                onUploadProgress: (progressEvent) => {
                  console.log((progressEvent.loaded / progressEvent.total) * 100, '%');
                },
                onUploadComplete: async (data) => {
                  console.log("Upload Complete!")
                  await fetchUserInfo()
                },
                isPrivate: false,
                doctype: "User",
                docname: userInfo.email,
                fieldname: "user_image"
              })
            } catch (error) {
              console.log(error)
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
