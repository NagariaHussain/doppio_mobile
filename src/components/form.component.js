import { useForm, Controller } from "react-hook-form";
import { Button, Text, Input } from "@ui-kitten/components";

import styled from "styled-components";

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export default function Form({ props }) {
    const { fields } = props
    const { control, handleSubmit, formState: { errors } } = useForm({});
    const onSubmit = data => console.log(data);

    return (
        <CenteredView>
            {fields.map((field, index) => (
                <Controller
                    key={index}
                    control={control}
                    rules={field.rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder={field.label}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            status={errors[field.name] ? "danger" : "basic"}
                        />
                    )}
                    name={field.name}
                />
            ))}

            <Text>{JSON.stringify(errors)}</Text>

            <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
        </CenteredView>
    );
}
