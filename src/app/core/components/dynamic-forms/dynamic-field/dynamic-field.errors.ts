export function throwDynamicFormMissingQuestionError(): Error {
  return Error('Attempting to create a Question without a Question @Input');
}

export function throwIncompatibleOptions(key: string): Error {
  return Error(`${key} is incompatiable with this Question type`);
}
