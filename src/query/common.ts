export function describeSubjectQuery(subjectId: string): string {
  return `
  describe <${subjectId}>
  `;
}

// export function describeSubjectQuery(subjectType: string, subjectId: string): string {
//   return `
//   describe ?p where {
//     ?p a <${subjectType}> ;
//     FILTER ( ?p = <${subjectId}>)
//   } 
//   `;
// }