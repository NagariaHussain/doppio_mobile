import { useForm, Controller } from "react-hook-form";
import { Button, Text, Input, CheckBox, Select, Datepicker } from "@ui-kitten/components";

import styled from "styled-components";

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  width: 100%;
  padding: 20px;
  row-gap: 10px;
`;

function renderFormField({ field, formField, formState: { errors } }) {
    if (field.type === "text") {
        return (
            <Input
                placeholder={field.label}
                onBlur={formField.onBlur}
                onChangeText={formField.onChange}
                value={formField.value}
                status={errors[field.name] ? "danger" : "basic"}
            />
        )
    } else if (field.type === "checkbox") {
        return (
            <CheckBox 
                checked={formField.value}
                onChange={formField.onChange}
            >
                {field.label}
            </CheckBox>
        )
}}

export default function Form({ props }) {
    const { fields } = props
    const { control, handleSubmit, formState: { errors, dirtyFields } } = useForm({});
    const onSubmit = data => console.log(data);

    return (
        <CenteredView>
            {fields.map((field, index) => (
                <Controller
                    key={index}
                    control={control}
                    rules={field.rules}
                    render={({ field: formField, formState }) => renderFormField({ field, formField, formState })}
                    name={field.name}
                />
            ))}

            <Text>{JSON.stringify(errors)}</Text>

            <Button onPress={handleSubmit(onSubmit)}>Save</Button>
        </CenteredView>
    );
}
