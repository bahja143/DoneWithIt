import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import * as Notifications from "expo-notifications";
import * as Yup from "yup";

import { Form, SellerInputForm, SubmitForm } from "./form";
import messagesApi from "../api/messages";
import colors from "../config/colors";

const schema = Yup.object({
  message: Yup.string().required().label("Message"),
});

const ContactSellerForm = ({ listing }) => {
  const [message] = useState({ message: "" });
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async ({ message }, { resetForm }) => {
    const response = await messagesApi.send(message, listing.id);

    if (!response.ok) {
      console.log("response: ", response);

      return Alert.alert("Error", "Could not send message to the seller.");
    }

    setSentSuccess(true);
    resetForm();
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Awesome!",
        body: "Your message was sent to the seller.",
      },
      trigger: {
        seconds: 1,
      },
    });
  };

  return (
    <View style={styles.container}>
      {sentSuccess && (
        <Text style={styles.successLabel}>Message was sent to the sender</Text>
      )}
      <Form
        initialValues={message}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <SellerInputForm placeholder="Message" name="message" />
        <View style={styles.btn}>
          <SubmitForm title="contact seller" />
        </View>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "88%",
    marginLeft: 27,
  },
  successLabel: {
    color: colors["secondary"],
    fontSize: 15.5,
    marginLeft: 5,
    fontWeight: "700",
  },
  btn: {
    top: 50,
  },
});

export default ContactSellerForm;