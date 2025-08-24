import { describe, it, expect } from 'vitest';
import { outdent } from 'outdent';
import { createTestTransform } from './test-kit';
import transformer from './lodash-deep-imports';

describe('lodash-deep-imports', () => {
  const transform = createTestTransform(transformer);

  it('should convert single named import to deep import', () => {
    const source = outdent`
      import { pluck } from 'lodash';

      const result = pluck(data, 'name');
    `;

    const expected = outdent`
      import pluck from 'lodash/pluck';

      const result = pluck(data, 'name');
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should convert multiple named imports to separate deep imports', () => {
    const source = outdent`
      import { map, filter, reduce } from 'lodash';

      const result = map(data, filter);
    `;

    const expected = outdent`
      import map from 'lodash/map';
      import filter from 'lodash/filter';
      import reduce from 'lodash/reduce';

      const result = map(data, filter);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle aliased imports correctly', () => {
    const source = outdent`
      import { map as mapFunc, filter as filterFunc } from 'lodash';

      const result = mapFunc(data, filterFunc);
    `;

    const expected = outdent`
      import mapFunc from 'lodash/map';
      import filterFunc from 'lodash/filter';

      const result = mapFunc(data, filterFunc);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should preserve existing imports and add lodash deep imports before them', () => {
    const source = outdent`
      import React from 'react';
      import { debounce, throttle } from 'lodash';
      import { Component } from '@angular/core';

      const debouncedFn = debounce(fn, 300);
    `;

    const expected = outdent`
      import debounce from 'lodash/debounce';
      import throttle from 'lodash/throttle';
      import React from 'react';
      import { Component } from '@angular/core';

      const debouncedFn = debounce(fn, 300);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle array utility functions', () => {
    const source = outdent`
      import { chunk, compact, concat, difference, drop, dropRight } from 'lodash';

      const chunks = chunk(array, 3);
      const clean = compact(array);
    `;

    const expected = outdent`
      import chunk from 'lodash/chunk';
      import compact from 'lodash/compact';
      import concat from 'lodash/concat';
      import difference from 'lodash/difference';
      import drop from 'lodash/drop';
      import dropRight from 'lodash/dropRight';

      const chunks = chunk(array, 3);
      const clean = compact(array);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle object utility functions', () => {
    const source = outdent`
      import { get, set, has, omit, pick, merge } from 'lodash';

      const value = get(obj, 'path.to.value');
      const merged = merge(obj1, obj2);
    `;

    const expected = outdent`
      import get from 'lodash/get';
      import set from 'lodash/set';
      import has from 'lodash/has';
      import omit from 'lodash/omit';
      import pick from 'lodash/pick';
      import merge from 'lodash/merge';

      const value = get(obj, 'path.to.value');
      const merged = merge(obj1, obj2);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle function utility functions', () => {
    const source = outdent`
      import { debounce, throttle, once, memoize, curry, partial } from 'lodash';

      const debouncedFn = debounce(fn, 300);
      const onceFn = once(fn);
    `;

    const expected = outdent`
      import debounce from 'lodash/debounce';
      import throttle from 'lodash/throttle';
      import once from 'lodash/once';
      import memoize from 'lodash/memoize';
      import curry from 'lodash/curry';
      import partial from 'lodash/partial';

      const debouncedFn = debounce(fn, 300);
      const onceFn = once(fn);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle string utility functions', () => {
    const source = outdent`
      import { camelCase, kebabCase, snakeCase, startCase, capitalize, trim } from 'lodash';

      const camelized = camelCase('hello world');
      const kebabized = kebabCase('hello world');
    `;

    const expected = outdent`
      import camelCase from 'lodash/camelCase';
      import kebabCase from 'lodash/kebabCase';
      import snakeCase from 'lodash/snakeCase';
      import startCase from 'lodash/startCase';
      import capitalize from 'lodash/capitalize';
      import trim from 'lodash/trim';

      const camelized = camelCase('hello world');
      const kebabized = kebabCase('hello world');
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle language utility functions', () => {
    const source = outdent`
      import { isArray, isObject, isString, isNumber, isFunction, isEmpty, clone, cloneDeep } from 'lodash';

      const isArr = isArray(value);
      const cloned = cloneDeep(obj);
    `;

    const expected = outdent`
      import isArray from 'lodash/isArray';
      import isObject from 'lodash/isObject';
      import isString from 'lodash/isString';
      import isNumber from 'lodash/isNumber';
      import isFunction from 'lodash/isFunction';
      import isEmpty from 'lodash/isEmpty';
      import clone from 'lodash/clone';
      import cloneDeep from 'lodash/cloneDeep';

      const isArr = isArray(value);
      const cloned = cloneDeep(obj);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle math utility functions', () => {
    const source = outdent`
      import { add, subtract, multiply, divide, max, min, sum, mean } from 'lodash';

      const total = sum(numbers);
      const maximum = max(numbers);
    `;

    const expected = outdent`
      import add from 'lodash/add';
      import subtract from 'lodash/subtract';
      import multiply from 'lodash/multiply';
      import divide from 'lodash/divide';
      import max from 'lodash/max';
      import min from 'lodash/min';
      import sum from 'lodash/sum';
      import mean from 'lodash/mean';

      const total = sum(numbers);
      const maximum = max(numbers);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle collection utility functions', () => {
    const source = outdent`
      import { forEach, map, filter, find, some, every, groupBy, sortBy } from 'lodash';

      const mapped = map(collection, fn);
      const filtered = filter(collection, predicate);
    `;

    const expected = outdent`
      import forEach from 'lodash/forEach';
      import map from 'lodash/map';
      import filter from 'lodash/filter';
      import find from 'lodash/find';
      import some from 'lodash/some';
      import every from 'lodash/every';
      import groupBy from 'lodash/groupBy';
      import sortBy from 'lodash/sortBy';

      const mapped = map(collection, fn);
      const filtered = filter(collection, predicate);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle number utility functions', () => {
    const source = outdent`
      import { random, clamp, inRange, ceil, floor, round } from 'lodash';

      const randomNum = random(1, 100);
      const clamped = clamp(value, 0, 100);
    `;

    const expected = outdent`
      import random from 'lodash/random';
      import clamp from 'lodash/clamp';
      import inRange from 'lodash/inRange';
      import ceil from 'lodash/ceil';
      import floor from 'lodash/floor';
      import round from 'lodash/round';

      const randomNum = random(1, 100);
      const clamped = clamp(value, 0, 100);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle date utility functions', () => {
    const source = outdent`
      import { now } from 'lodash';

      const timestamp = now();
    `;

    const expected = outdent`
      import now from 'lodash/now';

      const timestamp = now();
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should not modify files without lodash imports', () => {
    const source = outdent`
      import React from 'react';
      import { Component } from '@angular/core';

      const component = new Component();
    `;

    expect(transform({ source })).toEqual(source);
  });

  it('should not modify default imports from lodash', () => {
    const source = outdent`
      import _ from 'lodash';

      const result = _.map(data, fn);
    `;

    expect(transform({ source })).toEqual(source);
  });

  it('should not modify namespace imports from lodash', () => {
    const source = outdent`
      import * as _ from 'lodash';

      const result = _.map(data, fn);
    `;

    expect(transform({ source })).toEqual(source);
  });

  it('should handle mixed import types correctly', () => {
    const source = outdent`
      import _, { map, filter } from 'lodash';

      const result1 = _.reduce(data, fn);
      const result2 = map(data, fn);
    `;

    const expected = outdent`
      import map from 'lodash/map';
      import filter from 'lodash/filter';
      import _ from 'lodash';

      const result1 = _.reduce(data, fn);
      const result2 = map(data, fn);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should work with TypeScript files', () => {
    const source = outdent`
      import { map, filter } from 'lodash';

      interface User {
        id: number;
        name: string;
      }

      const users: User[] = [];
      const names: string[] = map(users, 'name');
    `;

    const expected = outdent`
      import map from 'lodash/map';
      import filter from 'lodash/filter';

      interface User {
        id: number;
        name: string;
      }

      const users: User[] = [];
      const names: string[] = map(users, 'name');
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should handle utility functions from various lodash categories', () => {
    const source = outdent`
      import { zipWith, unzip, unzipWith, flow, flowRight, identity, constant, noop, times, uniqueId } from 'lodash';

      const zipped = zipWith(arr1, arr2, fn);
      const flowed = flow(fn1, fn2, fn3);
    `;

    const expected = outdent`
      import zipWith from 'lodash/zipWith';
      import unzip from 'lodash/unzip';
      import unzipWith from 'lodash/unzipWith';
      import flow from 'lodash/flow';
      import flowRight from 'lodash/flowRight';
      import identity from 'lodash/identity';
      import constant from 'lodash/constant';
      import noop from 'lodash/noop';
      import times from 'lodash/times';
      import uniqueId from 'lodash/uniqueId';

      const zipped = zipWith(arr1, arr2, fn);
      const flowed = flow(fn1, fn2, fn3);
    `;

    expect(transform({ source })).toEqual(expected);
  });

  it('should preserve function calls and usage patterns', () => {
    const source = outdent`
      import { chain, map, filter, value } from 'lodash';

      const result = chain(data)
        .map(item => item.value)
        .filter(value => value > 0)
        .value();
    `;

    const expected = outdent`
      import chain from 'lodash/chain';
      import map from 'lodash/map';
      import filter from 'lodash/filter';
      import value from 'lodash/value';

      const result = chain(data)
        .map(item => item.value)
        .filter(value => value > 0)
        .value();
    `;

    expect(transform({ source })).toEqual(expected);
  });
});
