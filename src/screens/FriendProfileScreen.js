import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions,} from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { icons } from "./Icons/icons";

export default function FriendProfileScreen ({ route, navigation }) {

  const [completedChallenges, setCompletedChallenges] = useState([])
  const [completedFriendChallenges, setCompletedFriendChallenges] = useState([])
  const isFocused = useIsFocused();

  const {
    uid,
    firstName,
    lastName,
    totalPoints,
    createdAt,
    image
  } = route.params


  useEffect(()=> {
    async function getCompletedChallenges() {
      let currentUserUID = uid;
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/challenges/completedChallenges/${currentUserUID}`)
        setCompletedChallenges(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getCompletedChallenges();
  }, [isFocused])

  useEffect(() => {
    const fetchFriendChallenges = async () => {
      let currentUserUID = uid;
      try {
        const allFriendChallenges = await EXPRESS_ROOT_PATH.get(
          `/friendChallenges/${currentUserUID}`
        );
        const completedFriendChallenges = allFriendChallenges.data.filter(
          (challenge) => challenge.completionStatus === "completed"
        );
        setCompletedFriendChallenges(completedFriendChallenges);
      } catch (error) {
        console.log("there was an error fetching the challenges", error);
      }
    };
    fetchFriendChallenges();
  }, [isFocused]);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let date = new Date(createdAt)
  let joinedDate = date.toLocaleDateString(undefined, options)

  let status;
  if (totalPoints < 100) {
    status = "Master Racer";
  } else if (totalPoints < 200) {
    status = "Grand Master Racer";
  } else if (totalPoints < 400) {
    status = "Arch Master Racer";
  } else if (totalPoints < 600) {
    status = "Supreme Master Racer";
  } else {
    status = "Ultimate Master Racer";
  }


  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        {/* <View style={styles.shine} /> */}
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
      </View>

      <View style={styles.midBox}>
        <Text style={styles.totalPoints}>Total Points</Text>

        <View style={styles.numberBox}>
          <Text style={styles.totalPointsNumber}>{totalPoints}</Text>
        </View>
        <Text style={styles.badgesEarned}>Badges Earned</Text>

        {/* <View style={styles.shine} /> */}

        <ScrollView horizontal={true}>
          <FlatList
            horizontal
            data={completedChallenges}
            renderItem={({ item }) => (
              <View style={styles.completedChallenges}>
                <TouchableOpacity>
                  <Image source={icons[item.badge]} style={styles.badgeImg} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />

          <FlatList
            horizontal
            data={completedFriendChallenges}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity>
                  <Image source={icons[item.badge]} style={styles.badgeImg} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>

        <Text style={styles.createdAt}>{`Join Date: ${joinedDate}`}</Text>
      </View>

      <View style={styles.ImageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImg} />
        ) : (
          <Image
            style={styles.profileImg}
            source={require("../../assets/profileMain.png")}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 40,
    paddingTop: 40,
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },

  topBox: {
    display: "flex",
    width: 370,
    height: 230,
    backgroundColor: "#e1f2e5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#689451",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
    margin: 5,
  },
  status: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
    color: "#363533",
    fontWeight: "bold",
  },
  name: {
    color: "#689451",
    marginTop: 8,
    padding: 2,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },

  ImageContainer: {
    flex: 1,
    borderRadius: 150 / 2,
    top: 170,
    position: "absolute",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
    alignSelf: "center",
  },
  profileImg: {
    borderRadius: 150 / 2,
    width: 150,
    height: 150,
  },
  midBox: {
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    borderColor: "#689451",
    width: 370,
    height: 420,
    backgroundColor: "#e1f2e5",
    margin: 7,
    borderRadius: 20,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
  },
  totalPoints: {
    paddingTop: 90,
    textAlign: "center",
    paddingRight: 6,
    fontSize: 25,
    color: "#363533",
  },
  numberBox: {
    borderRadius: 10,
    margin: 5,
    backgroundColor: "#689451",
  },
  totalPointsNumber: {
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    fontSize: 30,
    padding: 5,
  },
  badgesEarned: {
    paddingTop: 20,
    fontSize: 25,
    color: "#363533",
  },
  badgeImg: {
    margin: 5,
    width: 50,
    height: 50,
  },
  shine: {
    width: 40,
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    alignSelf: "flex-end",
  },

  button: {
    marginHorizontal: 50,
    backgroundColor: "#bdb2ff",
    borderRadius: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  createdAt: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 11,
    color: "#363533",
  },
});
//   return (
//     <View style={styles.container}>
//       <View style={{width: 370, height: 230, backgroundColor: '#a7f9ef', borderRadius: 20, borderWidth: 6, borderColor: "#9deaff", shadowOffset:{  width: 10,  height: 10,  },
//       shadowColor: '#9deaff', shadowOpacity: 0.5}}>
//         <View style={{width: 40, height: 20, backgroundColor: 'white', borderRadius: 10, margin: 10, alignSelf: "flex-end"}}/>
//         <View>
//           <Text>{status}</Text>
//           <Text
//             style={styles.totalPoints}
//           >{`Total Points\n${totalPoints}`}</Text>
//         </View>
//         <View>
//           <Text style={styles.createdAt}>{`Joined Date\n${joinedDate}`}</Text>
//         </View>
//           <Text style={styles.name}>{firstName} {lastName}</Text>
//       </View>



//       <View style={{width: 370, height: 230, backgroundColor: '#fdffb6', margin: 7, borderRadius: 20, borderWidth: 6, borderColor: "#e4ffbb", shadowOffset:{  width: 10,  height: 10,  },
//       shadowColor: '#e4ffbb', shadowOpacity: 1.0}}>
//         <View style={{width: 40, height: 20, backgroundColor: 'white', borderRadius: 10, margin: 10, alignSelf: "flex-end"}}/>
//         <View>
//           <Text style={{padding: 6}}>My goals</Text>
//         </View>
//         <View>
//           <Text style={{padding: 6}}>Challenges Participated</Text>
//         </View>
//       </View>

//       <View style={styles.ImageContainer}>
//         {(image)
//         ? (<Image source={{ uri: image }} style={{ borderRadius: 150 / 2, width: 150, height: 150 }} />)
//         : (<Image
//         style={{borderRadius: 150 / 2, height: 150, width: 150}}
//         source={require("../../assets/profileMain.png")}/>)
//         }
//       </View>


//       <View style={{width: 370, height: 210, backgroundColor: '#ff87ab', margin: 7, borderRadius: 20, borderWidth: 6, borderColor: "#ff5d8f", shadowOffset:{  width: 10,  height: 10,  },
//       shadowColor: '#ff5d8f', shadowOpacity: 0.5}}>
//         <View style={{width: 40, height: 20, backgroundColor: 'white', borderRadius: 10, margin: 10, alignSelf: "flex-end"}}/>
//         <View>
//           <Text style={{padding: 6}}>Badges Earned</Text>
//         </View>

//         <ScrollView
//           style={styles.badgesEarned}
//           horizontal={true}
//           >
//           <FlatList
//             horizontal
//             data={completedChallenges}
//             renderItem={({ item }) => (
//               <View style={styles.completedChallenges}>
//                 <TouchableOpacity>
//                   <Image
//                     source={icons[item.badge]}
//                     style={{ margin: 5, width: 50, height: 50 }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             )}
//             keyExtractor={(item, index) => index}
//           />

//           <FlatList
//             horizontal
//             data={completedFriendChallenges}
//             renderItem={({ item }) => (
//               <View style={styles.completedChallenges}>
//                 <TouchableOpacity>
//                   <Image
//                     source={icons[item.badge]}
//                     style={{ margin: 5, width: 50, height: 50 }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             )}
//             keyExtractor={(item, index) => index}
//           />
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 15,
//     marginBottom: 5,
//   },
//   container: {
//     top: 40,
//     paddingTop: 40,
//     flex: 1,
//     alignItems: "center",
//     flexDirection: "column",
//   },

//   button: {
//     marginHorizontal: 50,
//     backgroundColor: "#bdb2ff",
//     borderRadius: 10,
//     height: 30,
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   createdAt: {
//     textAlign: "right",
//     paddingTop: 10,
//     paddingRight: 6,
//     fontWeight: "bold"
//   },
//   totalPoints: {
//    textAlign: "right",
//    paddingTop: 10,
//    paddingRight: 6,
//    fontWeight: "bold"
//   },
//   name: {
//     color: "black",
//     position: "absolute",
//     padding: 2,
//     fontSize: 16,
//     fontWeight: "bold",
//     left: 10,
//     bottom: -70,
//     height: "50%",
//   },
//   ImageContainer: {
//     borderRadius: 150 / 2,
//     top: 170,
//     position: "absolute",
//     shadowOffset:{  width: 10,  height: 10},
//     shadowColor: 'black',
//     shadowOpacity: 0.5,
//     alignSelf: "center"
//   },
//   badgesEarned: {
//     display: "flex",
//     left: 5,
//     marginBottom: 10,
//     flexDirection: "row",
//     alignContent: "space-between",
//     width: 350,
//     height: 200,
//     borderWidth: 4,
//     borderColor: "white",
//     borderRadius: 7,
//     backgroundColor: "#ff87ab"
//   },
//   activeChallengeContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignContent: "space-between",
//     width: 400,
//     height: 140,
//     color: "white"
//   },
// });
