
import csv

def parse_csv_to_array(csv_file):
    vocab_list = []

    with open(csv_file, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        
        # Skip the header row
        next(reader)
        
        for row in reader:
            meaning = row[1].replace('\n', ' ').replace('Meaning', '').strip()
            synonyms = row[2].replace('\n', ', ').replace('Synonyms', '').strip()
            sentences = row[3].replace('\n', ' ').replace('Sentences', '').strip()
            
            word_entry = {
                'Word': row[0],
                'Meaning': meaning,
                'Synonyms': synonyms,
                'Sentences': sentences
            }
            vocab_list.append(word_entry)

    return vocab_list


def write_to_js(vocab_list, output_file):
    with open(output_file, 'w', encoding='utf-8') as js_file:
        js_file.write('export const VOCAB_WORDS = [\n')
        for word_entry in vocab_list:
            js_file.write(f'  {word_entry},\n')
        js_file.write('];\n')

# Example usage:
csv_file = 'words.csv'  # Replace 'example.csv' with the path to your CSV file
output_file = 'output.js'  # Replace 'output.js' with the desired output file path
vocab_words = parse_csv_to_array(csv_file)
write_to_js(vocab_words, output_file)