import debounce from 'debounce';
import Input from "../UI/Input";

export default function NameFilter({ onChange } : { onChange: (name: string) => void}) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange(value);
    }
    return (
        <Input
            label="Player name"
            placeholder="Enter player username..."
            className="bg-white"
            containerClassName="w-full"
            onChange={debounce(handleChange, 300)}
            type="text"
        />
    )
}