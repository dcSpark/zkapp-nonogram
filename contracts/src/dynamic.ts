/**
 * Copied from https://github.com/gretzke/zkApp-data-types/blob/main/src/dynamicArray.ts
 * Which is provided under Apache 2 license by Daniel Gretzke
 */

import { Bool, Circuit, Field, Poseidon, Provable, Struct } from 'snarkyjs';

export { DynamicArray };

// type HashableProvable<T> = Provable<T> & {
//   hash(x: T): Field;
//   equals(x: T, other: T): Bool;
// };

// function hashable<T>(type: Provable<T>): HashableProvable<T> {
//   return {
//     ...type,
//     hash(x: T): Field {
//       return Poseidon.hash(type.toFields(x));
//     },
//     equals(x: T, other: T): Bool {
//       return this.hash(x).equals(this.hash(other));
//     },
//   };
// }

function DynamicArray<T>(type: Provable<T>, maxLength: number) {
  // const _type = hashable(type);
  function Null() {
    return type.fromFields(
      Array(type.sizeInFields()).fill(Field(0)),
      type.toAuxiliary()
    );
  }
  return class _DynamicArray extends Struct({
    length: Field,
    values: Circuit.array(type, maxLength),
  }) {
    //   static from(values: T[]): _DynamicArray {
    //     return new _DynamicArray(values);
    //   }

    //   static empty(length?: Field): _DynamicArray {
    //     const arr = new _DynamicArray();
    //     arr.length = length ?? Field(0);
    //     return arr;
    //   }

    public constructor(values?: T[]) {
      super({
        values: fillWithNull(values ?? [], maxLength),
        length: values === undefined ? Field(0) : Field(values.length),
      });
    }

    //   public get(index: Field): T {
    //     const mask = this.indexMask(index);
    //     return Circuit.switch(mask, type, this.values);
    //   }

    public set(index: Field, value: T): void {
      const mask = this.indexMask(index);
      for (let i = 0; i < this.maxLength(); i++) {
        this.values[i] = Circuit.switch([mask[i], mask[i].not()], type, [
          value,
          this.values[i],
        ]);
      }
    }

    //   public push(value: T): void {
    //     this.incrementLength(Field(1));
    //     this.set(this.length.sub(1), value);
    //   }

    public pop(n: Field): void {
      const mask = this.lengthMask(this.length.sub(n));
      this.decrementLength(n);

      for (let i = 0; i < this.maxLength(); i++) {
        this.values[i] = Circuit.switch([mask[i], mask[i].not()], type, [
          this.values[i],
          Null(),
        ]);
      }
    }

    //   public concat(other: this): this {
    //     const newArr = other.copy();
    //     newArr.shiftRight(this.length);
    //     let masked = Bool(true);
    //     for (let i = 0; i < this.maxLength(); i++) {
    //       masked = Circuit.if(Field(i).equals(this.length), Bool(false), masked);
    //       newArr.values[i] = Circuit.if(masked, this.values[i], newArr.values[i]);
    //     }
    //     return newArr;
    //   }

    //   public copy(): this {
    //     const newArr = new (<any>this.constructor)();
    //     newArr.values = this.values.slice();
    //     newArr.length = this.length;
    //     return newArr;
    //   }

    //   public slice(start: Field, end: Field): this {
    //     const newArr = this.copy();
    //     newArr.shiftLeft(start);
    //     newArr.pop(newArr.length.sub(end.sub(start)));
    //     return newArr;
    //   }

    //   public insert(index: Field, value: T): void {
    //     const arr1 = this.slice(Field(0), index);
    //     const arr2 = this.slice(index, this.length);
    //     arr2.shiftRight(Field(1));
    //     arr2.set(Field(0), value);
    //     const concatArr = arr1.concat(arr2);
    //     this.values = concatArr.values;
    //     this.length = concatArr.length;
    //   }

    //   public includes(value: T): Bool {
    //     let result = Field(0);
    //     for (let i = 0; i < this.maxLength(); i++) {
    //       result = result.add(
    //         Circuit.if(_type.equals(this.values[i], value), Field(1), Field(0))
    //       );
    //     }
    //     return result.equals(Field(0)).not();
    //   }

    //   public assertIncludes(value: T): void {
    //     this.includes(value).assertTrue();
    //   }

    //   public shiftLeft(n: Field): void {
    //     n.equals(this.length).assertFalse();
    //     this.decrementLength(n);

    //     const nullArray = _DynamicArray.empty(n);

    //     const possibleResults = [];
    //     const mask = [];
    //     for (let i = 0; i < this.maxLength(); i++) {
    //       possibleResults[i] = this.values
    //         .slice(i, this.maxLength())
    //         .concat(nullArray.values.slice(0, i));
    //       mask[i] = Field(i).equals(n);
    //     }

    //     const result = [];
    //     for (let i = 0; i < this.maxLength(); i++) {
    //       const possibleFieldsAtI = possibleResults.map((r) => r[i]);
    //       result[i] = Circuit.switch(mask, type, possibleFieldsAtI);
    //     }
    //     this.values = result;
    //   }

    //   public shiftRight(n: Field): void {
    //     const nullArray = _DynamicArray.empty(n);
    //     this.incrementLength(n);

    //     const possibleResults = [];
    //     const mask = [];
    //     for (let i = 0; i < this.maxLength(); i++) {
    //       possibleResults[i] = nullArray.values
    //         .slice(0, i)
    //         .concat(this.values.slice(0, this.maxLength() - i));
    //       mask[i] = Field(i).equals(nullArray.length);
    //     }

    //     const result = [];
    //     for (let i = 0; i < this.maxLength(); i++) {
    //       const possibleFieldsAtI = possibleResults.map((r) => r[i]);
    //       result[i] = Circuit.switch(mask, type, possibleFieldsAtI);
    //     }
    //     this.values = result;
    //   }

    //   public hash(): Field {
    //     return Poseidon.hash(this.values.map((v) => type.toFields(v)).flat());
    //   }

    public maxLength(): number {
      return maxLength;
    }

    //   public toString(): string {
    //     return this.values.slice(0, parseInt(this.length.toString())).toString();
    //   }

    public indexMask(index: Field): Bool[] {
      const mask = [];
      let lengthReached = Bool(false);
      for (let i = 0; i < this.maxLength(); i++) {
        lengthReached = Field(i).equals(this.length).or(lengthReached);
        const isIndex = Field(i).equals(index);
        // assert index < length
        // isIndex.and(lengthReached).not().assertTrue();
        mask[i] = isIndex;
      }
      return mask;
    }

    public incrementLength(n: Field): void {
      const newLength = this.length.add(n);
      // assert length + n <= maxLength
      // let lengthLteMaxLength = Bool(false);
      // for (let i = 0; i < this.maxLength() + 1; i++) {
      //   lengthLteMaxLength = lengthLteMaxLength.or(Field(i).equals(newLength));
      // }
      // lengthLteMaxLength.assertTrue();
      this.length = newLength;
    }

    public decrementLength(n: Field): void {
      this.length = this.length.sub(n);
      // make sure length did not underflow
      // let newLengthFound = Bool(false);
      // for (let i = 0; i < this.maxLength() + 1; i++) {
      //   newLengthFound = newLengthFound.or(Field(i).equals(this.length));
      // }
      // newLengthFound.assertTrue();
    }

    public lengthMask(n: Field): Bool[] {
      const mask = [];
      let masked = Bool(true);
      for (let i = 0; i < this.maxLength(); i++) {
        masked = Circuit.if(Field(i).equals(n), Bool(false), masked);
        mask[i] = masked;
      }
      return mask;
    }

    // public map(fn: (v: T, i: Field) => T): this {
    //   const newArr = this.copy();
    //   let masked = Bool(true);
    //   for (let i = 0; i < newArr.values.length; i++) {
    //     masked = Circuit.if(
    //       Field(i).equals(newArr.length),
    //       Bool(false),
    //       masked
    //     );
    //     newArr.values[i] = Circuit.if(
    //       masked,
    //       fn(newArr.values[i], Field(i)),
    //       Null()
    //     );
    //   }
    //   return newArr;
    // }
  };

  function fillWithNull([...values]: T[], length: number): T[] {
    for (let i = values.length; i < length; i++) {
      values[i] = Null();
    }
    return values;
  }
}
