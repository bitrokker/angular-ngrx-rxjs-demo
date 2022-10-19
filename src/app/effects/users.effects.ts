import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { addUserToList, createUser, deleteUser, deleteUserToList, getUserList, loadUserList, updateUser, updateUserToList } from '../actions/users.actions';
import { IUser, IUserList } from '../interfaces/users.interface';
import { ReqresApiService } from '../services/reqresApi.service';

@Injectable()
export class UsersEffects {

  constructor(
    private _actions$: Actions,
    private _reqresinService: ReqresApiService
  ) {}

  /**
   * Effect wird bei Action getUserList asugefüht und läd User Liste von API und führt anschliessend  Action loadUserList aus.
   */ 
  public getUserList$: Observable<Action> = createEffect(() => {
    return this._actions$.pipe(
      ofType(getUserList),
      mergeMap((action) => {
        return this._reqresinService.getUserListByPage$(action.page).pipe(
          map((userList: IUserList) => {
            return loadUserList({ payload: userList });
          })
        );
      })
    );
  });

  /**
   * Effect wird bei Action createUser asugefüht und läd User Liste von API und führt anschliessend Action addUserList aus.
   */
  public createUser$: Observable<Action> = createEffect(() => {
    return this._actions$.pipe(
      ofType(createUser),
      mergeMap((action) => {
        return this._reqresinService.createUserByUser$(action.payload).pipe(
          map((user: IUser) => {  
            return addUserToList({ payload: user });
          })
        );
      })
    );
  });
  
  /**
   * Effect update User via REST API Service und führt anschliessend Action updateUserToList aus.
   */
  public updateUser$: Observable<Action> = createEffect(() => {
    return this._actions$.pipe(
      ofType(updateUser),
      mergeMap((action) => {
        return this._reqresinService.updateUserByIdAndUser$(action.userId, action.userData).pipe(
          map((user: IUser) => {
            return updateUserToList({ userId: action.userId, userData: user });
          })
        );
      })
    );
  });

  public deleteUser$: Observable<Action> = createEffect(() => {
    return this._actions$.pipe(
      ofType(deleteUser),
      mergeMap((action) => {
        return this._reqresinService.deleteUserById$(action.id).pipe(
          map((res) => {  
            return deleteUserToList({id: action.id});
          })
        );
      })
    );
  })
}
