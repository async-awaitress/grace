import axios from "axios";
import React from "react";

const GOT_CHALLENGES = "GOT_CHALLENGES";

export const gotChallenges = (challenges) => ({
  type: GOT_CHALLENGES,
  challenges,
});

// const SET_CHALLENGES = "SET_CHALLENGES";

// export const setChallenges = (challenges) => ({
//   type: SET_CHALLENGES,
//   challenges,
// });

// const CLEAR_CHALLENGES = "CLEAR_CHALLENGES";
// export const clearChallenges = () => ({ type: CLEAR_CHALLENGES });

// export const setChallengesThunk = (challenges) => async (dispatch) => {
//   try {
//     let token = await firebase.auth().currentUser.getIdToken();
//     let { data, status } = await instance.post("/challenges", { challenges, token });
//     if (status === 200) {
//       dispatch(setGoals(data));
//     } else {
//       console.log("error setting challenge in database, status error: ", status);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const deleteChallengeThunk = (challengeId, challenges) => async (
//   dispatch
// ) => {
//   try {
//     let { status } = await instance.delete(`/challenges/${challengeId}`);

//     if (status === 200) {
//       console.log("challenge successfully deleted");
//       dispatch(
//         gotchallenges(
//           challenges.filter((challenge) => challengeId !== challenge.id)
//         )
//       );
//     } else {
//       console.log("error deleting goals in database, status error: ", status);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const completedDaysThunk = (challengeId) => async (dispatch) => {
//   try {
//     await instance.put(`challenges/${challengeId}`);
//     let token = await firebase.auth().currentUser.getIdToken();
//     const { data } = await instance.post(`/challenges/allChallenges`, {
//       token,
//     });
//     dispatch(gotChallenges(data));
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getChallengesThunk = () => async (dispatch) => {
  try {
    // let token = await firebase.auth().currentUser.getIdToken();
    const { data } = await axios.get("/api/challenges");
    dispatch(gotChallenges(data));
    // ", { token }" after the url
  } catch (error) {
    console.log("there was an error trying to get the challenges", error);
  }
};

// export const resetChallengesThunk = (uid) => async (dispatch) => {
//   try {
//     const res = await instance.put(`/challenges/reset`, { uid });
//     dispatch(gotChallenges(res.data));
//   } catch (error) {
//     console.log(error);
//   }
// };

const challengesReducer = (state = [], action) => {
  switch (action.type) {
    case GOT_CHALLENGES:
      return action.challenges;
    // case SET_CHALLENGES:
    //   return action.challenges;
    // case CLEAR_CHALLENGES:
    //   return [];
    default:
      return state;
  }
};
export default challengesReducer;
