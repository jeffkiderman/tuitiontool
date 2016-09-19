'use strict'
// @flow

export type KidObject = {
  id: number,
  gender: 'male' | 'female' | '',
  grade: number,
  name: ?string,
  onKidRemove: (id: number) => void,
  onKidChange: (id: number, updatedKid: Object) => void,
  returningToSchool: boolean
};

export type SchoolOption = {
  value: number,
  name: string,
  hasData: boolean
};
