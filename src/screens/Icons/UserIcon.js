import React from "react";
import { View } from "react-native";
import IconBadge from "react-native-icon-badge";
import { Feather } from "@expo/vector-icons";

class UserIcon extends React.Component {
  render() {
    const color = this.props.focused ? "#9FC78A" : "#8688BC";
    return (
      <View>
        <IconBadge
          MainElement={<Feather name="user" size={20} color={color} />}
          Hidden={true}
        />
      </View>
    );
  }
}

export default UserIcon;
