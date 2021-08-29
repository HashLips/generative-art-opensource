const {
  saveImage,
  signImage,
  loadLayerImg,
  constructLayerToDna,
  getRarity,
  isDnaUnique,
  createDna,
} = require('./generate');
const fs = require('fs');

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  readdirSync: () => ['original'],
}));

var mockToBuffer;
var mockContext;
var mockLoadImage;

jest.mock('canvas', () => {
  mockToBuffer = jest.fn();
  mockContext = {
    fillText: jest.fn(),
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    drawImage: jest.fn(),
  };
  mockLoadImage = jest.fn();
  return {
    createCanvas: () => ({
      getContext: (_) => mockContext,
      toBuffer: mockToBuffer,
    }),
    loadImage: mockLoadImage,
  };
});

describe('index.js', () => {
  // beforeEach(() => {
  //     // mockContext.
  // })

  describe('saveImage', () => {
    it('should write to file', () => {
      const buffer = 'a buffer';
      mockToBuffer.mockReturnValue(buffer);

      saveImage(2);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `./output/${2}.png`,
        buffer
      );
      expect(mockToBuffer).toHaveBeenCalledWith('image/png');
    });
  });

  describe('signImage', () => {
    it('should fill in text', () => {
      const imgText = 'this is text';
      signImage(imgText);

      expect(mockContext.fillText).toHaveBeenCalledWith(imgText, 40, 40);
    });
  });

  describe('loadLayerImg', () => {
    it('should resolve with new layer object', async () => {
      const exImage = {};
      mockLoadImage.mockResolvedValue(exImage);

      const layer = {
        selectedElement: {
          path: 'path/here',
        },
      };

      const result = await loadLayerImg(layer);

      expect(result).toEqual({ layer: layer, loadedImage: exImage });
    });
  });

  describe('constructLayterToDna', () => {
    it('should map the inputs and return new layter object', () => {
      const dna = [0];
      const layers = [
        {
          position: { x: 0, y: 0 },
          size: { width: 10, height: 10 },
          elements: { original: [{ name: 'stuff', path: '/path' }] },
        },
      ];
      const rarity = 'original';

      const result = constructLayerToDna(dna, layers, rarity);

      expect(result).toEqual([
        {
          position: layers[0].position,
          size: layers[0].size,
          selectedElement: layers[0].elements['original'][0],
        },
      ]);
    });
  });

  describe('getRarity', () => {
    it('should get the proper rarity of super rare for edition 1', () => {
      const result = getRarity(1);

      expect(result).toEqual('super_rare');
    });

    it('should get the proper rarity of rare for edition 2-4', () => {
      const result1 = getRarity(2);
      const result2 = getRarity(4);

      expect(result1).toEqual('rare');
      expect(result2).toEqual('rare');
    });

    it('should get the proper rarity of original for edition 5+', () => {
      const result = getRarity(6);

      expect(result).toEqual('original');
    });

    it('should return empty string if out of bounds edition', () => {
      const result = getRarity(16);

      expect(result).toBeFalsy();
    });
  });

  describe('isDnaUnique', () => {
    it('should return true when dna is uniqe', () => {
      const allDna = [
        [12, 23, 43, 54],
        [13, 87, 45, 65],
      ];
      const toTestDna = [12, 12, 45, 66];

      const result = isDnaUnique(allDna, toTestDna);

      expect(result).toBeTruthy();
    });

    it('should return false when dna is NOT uniqe', () => {
      const allDna = [
        [12, 12, 45, 66],
        [13, 87, 45, 65],
      ];
      const toTestDna = [12, 12, 45, 66];

      const result = isDnaUnique(allDna, toTestDna);

      expect(result).toBeFalsy();
    });
  });

  describe('createDna', () => {
    it('should create dna for layer and rarity', () => {
      const rarity = 'original';
      const layers = [
        {
          elements: {
            original: [{ test: 'obj' }],
          },
        },
        {
          elements: {
            original: [{ test: 'obj2' }, { test: 'obj3' }],
          },
        },
      ];

      const result = createDna(layers, rarity);

      expect(result.length).toEqual(2);
    });
  });
});
