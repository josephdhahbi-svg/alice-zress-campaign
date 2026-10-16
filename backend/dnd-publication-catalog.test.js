"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const c=require("./dnd-publication-catalog");
test("publication index is chronological and explicitly incomplete",()=>{
 const all=c.listPublications({limit:200});assert.ok(all.total>=80);assert.equal(all.complete,false);
 for(let i=1;i<all.entries.length;i++)assert.ok(all.entries[i-1].publicationDate<=all.entries[i].publicationDate);
 assert.equal(all.entries[0].publicationDate,"1974");
 assert.equal(all.entries.at(-1).title,"Arcana Unleashed");
});
test("filters and historical lore crosswalk are available without invented dates",()=>{
 const modern=c.listPublications({fromYear:2024,limit:200});
 assert.ok(modern.entries.every(x=>Number(x.publicationDate.slice(0,4))>=2024));
 for(const x of modern.entries){assert.ok(x.inWorld);assert.equal(x.inWorld.calendar,"UNRESOLVED")}
 assert.equal(c.getPublication("not_found"),null);
 assert.throws(()=>c.listPublications({limit:500}),TypeError);
});
