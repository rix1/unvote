import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("./un_voting_data.db");

export function test(nums: number[], multiplier: number) {
  for (const num of nums) {
    db.query(`INSERT INTO test (count, created_at) VALUES (?, CURRENT_DATE)`, [
      num * multiplier,
    ]);
  }
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let i = 1; i <= 10; i++) {
  console.log("starting new row:", i);
  test(arr, i);
}
