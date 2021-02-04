import React from "react";
import { View } from "react-native";
import IconBadge from "react-native-icon-badge";
import { Feather } from "@expo/vector-icons";

class FriendsIcon extends React.Component {
  render() {
    const color = this.props.focused ? "#689451" : "#383db8";
    return (
      <View>
        <IconBadge
          MainElement={<Feather name="users" size={20} color={color} />}
          Hidden={true}
        />
      </View>
    );
  }
}

export default FriendsIcon;
