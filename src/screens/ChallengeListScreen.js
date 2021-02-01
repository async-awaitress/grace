// import React, { Component } from "react";
// import {
//   Text,
//   View,
//   Modal,
//   Image,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import { connect } from "react-redux";
// import { getChallengesThunk } from "../../redux/reducers/allChallenges";

// class ChallengeListScreen extends React.Component() {
//   //   async componentDidMount() {
//   //     await this.props.getChallenges();
//   //   }
//   //   render() {
//   //     return (
//   //       <View>
//   //         <Text>Hello from the other side</Text>
//   //       </View>
//   //     );
//   //     // const { challenges, navigation } = this.props || [];
//   //     // return (
//   //     //   <View>
//   //     //     <View>
//   //     //       <Text>Hello Friend!</Text>
//   //     //       <Text>Select a challenge to view its details!</Text>
//   //     //       <ScrollView>
//   //     //         <View style={{ paddingBottom: 200 }}>
//   //     //           {challenges.map((challenge, idx) => (
//   //     //             <View key={idx + 1}>
//   //     //               <View>
//   //     //                 <TouchableOpacity
//   //     //                   onPress={() => navigation.navigate("Challenge Details")}
//   //     //                 >
//   //     //                   <Text> Challenge One</Text>
//   //     //                 </TouchableOpacity>
//   //     //                 <Text>
//   //     //                   {idx + 1}. {challenge.title}
//   //     //                 </Text>
//   //     //                 {/* <CustomDelButton onPress={() => handleChallengeDel(challenge.title, challenge, props.challenges)} /> */}
//   //     //               </View>
//   //     //             </View>
//   //     //           ))}
//   //     //         </View>
//   //     //       </ScrollView>
//   //     //     </View>
//   //     //   </View>
//   //     // );
//   //   }
// }

// // const mapState = (state) => ({
// //   challenges: state.challenges,
// // });

// // const mapDispatch = (dispatch) => ({
// //   getChallenges: () => dispatch(getChallengesThunk()),
// //   // setChallenges: challenges => dispatch(gotChallenges(challenges)),
// //   // deleteChallenge: (challengeId, challenges) => dispatch(deleteChallengeThunk(challengeId, challenges))
// // });

// // export default connect(mapState, mapDispatch)(ChallengeListScreen);
// export default ChallengeListScreen;
