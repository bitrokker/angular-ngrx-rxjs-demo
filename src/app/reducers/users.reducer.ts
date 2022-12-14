import { createReducer, on } from '@ngrx/store';
import { UserActions} from '../actions/users.actions';
import { IUserListState, IUserList } from '../interfaces/users.interface';

export const usersFeatureKey = 'users';

export const initialState: IUserListState = {
  usersList: <IUserList>{},
  isLoading: false,
  error: null
};

export const userListReducer = createReducer(
  initialState, 
  on(
    UserActions.getUserList,
    (state: IUserListState, { page: number }) => {
      return { ...state, error: null, isLoading: true }
    }
  ),
  on(
    UserActions.setUserError,
    (state: IUserListState, { error }) => {
      return { ...state, error: error, isLoading: false }
    }
  ),
  on(
    UserActions.loadUserList,
    (state: IUserListState, { payload }) => { 
      return { ...state, usersList: payload, isLoading: false, error: null };
    }
  ),
  on(
    UserActions.createUser,
    (state: IUserListState) => {
      return {...state, isLoading: true, error: null }
    }
  ),
  on(
    UserActions.addUserToList,
    (state: IUserListState, { payload }) => {
      let cloneState = <IUserListState>JSON.parse(JSON.stringify(state)); 
      cloneState.usersList.data.push(payload); // füge daten zu State hinzu, da Demo REST API Daten nicht schreibt
      return { ...cloneState, isLoading: false, error: null };
    }
  ),
  on(
    UserActions.updateUser,
    (state: IUserListState) => {
      return { ...state, isLoading: true, error: null }
    }
  ),
  on(
    UserActions.updateUserToList,
    (state: IUserListState, { userId, userData }) => {
      let cloneState = <IUserListState>JSON.parse(JSON.stringify(state));
      for(let user of cloneState.usersList.data) {
        if(user.id !== userId) { continue; }

        user = Object.assign(user, userData); // update daten im State, da Demo REST API Daten nicht schreibt
        break;
      }
      return { ...cloneState, isLoading: false, error: null };
    }
  ),
  on(
    UserActions.deleteUserToList,
    (state: IUserListState, { id }) => {   
      const filterData = state.usersList.data.filter(x => x.id !== id);
      let cloneState = <IUserListState>JSON.parse(JSON.stringify(state));
      cloneState.usersList.data = [...filterData]; // lösche daten im State, da Demo REST API Daten nicht schreibt
      return { ...cloneState, isLoading: false, error: null };
    }
  )
);
