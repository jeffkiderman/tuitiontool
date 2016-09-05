'use strict'
// @flow

export type KidObject = {
  id: number,
  grade: number,
  name: ?string,
  gender: 'male' | 'female' | '',
  onKidRemove: (id: number) => void,
  onKidChange: (id: number, updatedKid: Object) => void
};

export type SchoolOption = {
  value: number,
  name: string,
  hasData: boolean
};
